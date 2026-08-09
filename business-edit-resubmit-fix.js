// Попитай.Лом — надеждно повторно изпращане на коригиран фирмен профил
(() => {
  "use strict";

  const businessId = new URLSearchParams(window.location.search).get("edit");
  const client = window.PopitaiSupabase;
  if (!businessId || !client || client.__popitaiBusinessEditRpcFixed) return;

  client.__popitaiBusinessEditRpcFixed = true;
  const originalRpc = client.rpc.bind(client);

  async function currentUser() {
    const { data, error } = await client.auth.getUser();
    return error ? null : data?.user || null;
  }

  async function resubmit(args) {
    const user = await currentUser();
    if (!user) {
      return {
        data: null,
        error: { code: "42501", message: "Трябва да влезеш в профила си." }
      };
    }

    const { error } = await client
      .from("businesses")
      .update({
        name: String(args?.p_name || "").trim(),
        category: String(args?.p_category || "").trim(),
        phone: String(args?.p_phone || "").trim(),
        description: String(args?.p_description || "").trim(),
        status: "pending",
        moderation_note: "",
        reviewed_by: null,
        reviewed_at: null,
        updated_at: new Date().toISOString()
      })
      .eq("id", args?.p_business_id || businessId)
      .eq("owner_id", user.id)
      .in("status", ["needs_changes", "pending"]);

    if (error) return { data: null, error };

    const { data: check, error: checkError } = await client
      .from("businesses")
      .select("id, status")
      .eq("id", args?.p_business_id || businessId)
      .eq("owner_id", user.id)
      .maybeSingle();

    if (checkError) return { data: null, error: checkError };
    if (check?.status !== "pending") {
      return {
        data: null,
        error: { code: "P0001", message: "Корекциите не бяха записани." }
      };
    }

    return { data: check.id, error: null };
  }

  async function deleteMediaWithAdminFallback(args, options) {
    const result = await originalRpc("delete_own_business_media", args, options);
    if (!result?.error) return result;

    const user = await currentUser();
    if (!user) return result;

    const { data: profile } = await client
      .from("profiles")
      .select("role, is_blocked")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.is_blocked || !["admin", "moderator"].includes(profile?.role)) return result;

    const { data: row, error: rowError } = await client
      .from("media")
      .select("id, owner_id, storage_path")
      .eq("id", args?.p_media_id)
      .eq("owner_id", user.id)
      .maybeSingle();

    if (rowError || !row) return result;

    const { error: deleteError } = await client
      .from("media")
      .delete()
      .eq("id", row.id)
      .eq("owner_id", user.id);

    if (deleteError) return { data: null, error: deleteError };
    return { data: row.storage_path, error: null };
  }

  client.rpc = function popitaiRpc(functionName, args, options) {
    if (functionName === "resubmit_own_business") return resubmit(args || {});
    if (functionName === "delete_own_business_media") {
      return deleteMediaWithAdminFallback(args || {}, options);
    }
    return originalRpc(functionName, args, options);
  };
})();
