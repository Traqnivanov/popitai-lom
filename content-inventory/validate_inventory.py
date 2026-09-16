#!/usr/bin/env python3
"""Deterministic Content Inventory V1 validation; standard library only."""

from __future__ import annotations

import json
import re
import sys
from datetime import date
from pathlib import Path


ROOT = Path(__file__).resolve().parent
DATA_PATH = ROOT / "records.v1.json"
SCHEMA_PATH = ROOT / "schema.v1.json"

ENTITY_TYPES = {"accommodation", "fuel_station", "dining", "organization", "visitor_place", "article"}
EVIDENCE_STATUSES = {"officially_verified", "owner_confirmed_partial", "conflict", "candidate_unverified"}
READINESS = {"verified_for_bounded_prototype", "research_only", "blocked"}
FIELD_STATUSES = {"official", "owner_confirmed", "secondary_signal", "local_signal", "unverified", "conflict"}
SOURCE_TYPES = {"official_registry", "official_operator", "official_site", "official_social", "municipality", "institution", "owner_confirmation", "secondary", "local_signal"}
OFFICIAL_SOURCE_TYPES = {"official_registry", "official_operator", "official_site", "official_social", "municipality", "institution"}
ID_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
FORBIDDEN_DYNAMIC_KEYS = {"price", "prices", "availability", "цена", "цени", "наличност"}

OWNER_MAP = {
    "accommodation": ("firms", "businesses", "Настаняване", None),
    "dining": ("firms", "businesses", "Заведения", None),
    "fuel_station": ("info_lom", "info_entries", "komunalni", "benzinostantsii"),
}


def fail(errors: list[str], where: str, message: str) -> None:
    errors.append(f"{where}: {message}")


def read_json(path: Path) -> dict:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def valid_date(value: object) -> bool:
    if not isinstance(value, str):
        return False
    try:
        date.fromisoformat(value)
    except ValueError:
        return False
    return True


def validate() -> list[str]:
    errors: list[str] = []
    schema = read_json(SCHEMA_PATH)
    data = read_json(DATA_PATH)

    if schema.get("$schema") != "https://json-schema.org/draft/2020-12/schema":
        fail(errors, "schema", "unexpected JSON Schema dialect")
    if data.get("schema_version") != "1.0":
        fail(errors, "root", "schema_version must be 1.0")
    if data.get("source_of_truth") != "preproduction_inventory":
        fail(errors, "root", "source_of_truth must be preproduction_inventory")
    if not valid_date(data.get("updated_at")):
        fail(errors, "root", "updated_at must be an ISO date")

    records = data.get("records")
    if not isinstance(records, list):
        return errors + ["root: records must be an array"]

    seen_ids: set[str] = set()
    for index, record in enumerate(records):
        where = f"records[{index}]"
        if not isinstance(record, dict):
            fail(errors, where, "record must be an object")
            continue

        required = {"id", "entity_type", "public_name", "canonical_owner", "evidence_status", "publication_readiness", "owner_confirmed", "fields", "sources", "open_fields", "prototype", "production"}
        missing = sorted(required - record.keys())
        if missing:
            fail(errors, where, f"missing required keys: {', '.join(missing)}")
            continue

        record_id = record["id"]
        if not isinstance(record_id, str) or not ID_RE.fullmatch(record_id):
            fail(errors, where, "invalid id")
        elif record_id in seen_ids:
            fail(errors, where, f"duplicate id {record_id}")
        else:
            seen_ids.add(record_id)

        entity_type = record["entity_type"]
        if entity_type not in ENTITY_TYPES:
            fail(errors, where, f"unknown entity_type {entity_type!r}")
        if record["evidence_status"] not in EVIDENCE_STATUSES:
            fail(errors, where, "invalid evidence_status")
        if record["publication_readiness"] not in READINESS:
            fail(errors, where, "invalid publication_readiness")
        if not isinstance(record["owner_confirmed"], bool):
            fail(errors, where, "owner_confirmed must be boolean")

        owner = record["canonical_owner"]
        if not isinstance(owner, dict):
            fail(errors, where, "canonical_owner must be an object")
        elif entity_type in OWNER_MAP:
            expected = OWNER_MAP[entity_type]
            actual = (owner.get("system"), owner.get("collection"), owner.get("category"), owner.get("subcategory"))
            if actual != expected:
                fail(errors, where, f"owner mapping {actual!r} does not match {expected!r}")

        sources = record["sources"]
        if not isinstance(sources, list):
            fail(errors, where, "sources must be an array")
            sources = []
        source_by_id: dict[str, dict] = {}
        for source in sources:
            if not isinstance(source, dict) or not isinstance(source.get("id"), str):
                fail(errors, where, "every source needs a string id")
                continue
            if source["id"] in source_by_id:
                fail(errors, where, f"duplicate source id {source['id']}")
            source_by_id[source["id"]] = source
            if source.get("type") not in SOURCE_TYPES:
                fail(errors, where, f"invalid source type for {source['id']}")
            if not valid_date(source.get("checked_at")):
                fail(errors, where, f"invalid checked_at for {source['id']}")

        fields = record["fields"]
        if not isinstance(fields, dict):
            fail(errors, where, "fields must be an object")
            fields = {}
        for field_name, field in fields.items():
            if field_name.casefold() in FORBIDDEN_DYNAMIC_KEYS:
                fail(errors, where, f"dynamic field {field_name!r} is forbidden")
            if not isinstance(field, dict):
                fail(errors, where, f"field {field_name!r} must be an object")
                continue
            if field.get("status") not in FIELD_STATUSES:
                fail(errors, where, f"field {field_name!r} has invalid status")
            source_ids = field.get("source_ids")
            if not isinstance(source_ids, list):
                fail(errors, where, f"field {field_name!r} source_ids must be an array")
                continue
            missing_sources = sorted(set(source_ids) - source_by_id.keys())
            if missing_sources:
                fail(errors, where, f"field {field_name!r} references missing sources: {missing_sources}")
            if field.get("status") == "official":
                official = any(source_by_id.get(source_id, {}).get("type") in OFFICIAL_SOURCE_TYPES for source_id in source_ids)
                if not official:
                    fail(errors, where, f"official field {field_name!r} lacks an official source")

        prototype = record["prototype"]
        if not isinstance(prototype, dict):
            fail(errors, where, "prototype must be an object")
        elif prototype.get("selected") and not prototype.get("eligible"):
            fail(errors, where, "prototype.selected requires prototype.eligible")

        production = record["production"]
        if not isinstance(production, dict) or production.get("write_allowed") is not False:
            fail(errors, where, "production.write_allowed must remain false")

        open_fields = record["open_fields"]
        if not isinstance(open_fields, list) or len(open_fields) != len(set(open_fields)):
            fail(errors, where, "open_fields must be a unique array")
        if record["evidence_status"] == "conflict" and not open_fields:
            fail(errors, where, "conflict records require open_fields")

    return errors


if __name__ == "__main__":
    try:
        validation_errors = validate()
    except (OSError, json.JSONDecodeError) as exc:
        print(f"INVALID: {exc}", file=sys.stderr)
        raise SystemExit(1)

    if validation_errors:
        print("INVALID CONTENT INVENTORY", file=sys.stderr)
        for validation_error in validation_errors:
            print(f"- {validation_error}", file=sys.stderr)
        raise SystemExit(1)

    count = len(read_json(DATA_PATH)["records"])
    print(f"VALID Content Inventory V1: {count} records; production writes disabled")
