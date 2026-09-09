'use strict';

const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

const context={
  window:{PopitaiApprovedContent:{}},
  Intl,Date,Object,Array,Number,String,Boolean,Math,Set,
  esc:value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))
};
vm.createContext(context);
vm.runInContext(fs.readFileSync(require.resolve('./prototype-home.js'),'utf8'),context);
const {activityModel,activityMarkup}=context.window.PopitaiHomeViews;
const now=new Date('2026-09-09T12:00:00+03:00');
const record=(id,date,extra={})=>({id,contentType:'listing',publishedAt:date,status:'approved',visibility:'public',...extra});
const empty=()=>({latest:[],publications:[],articles:[],events:[]});

const today=empty();
today.latest=[record('one','2026-09-09T08:00:00+03:00')];
assert.equal(activityModel(today,now).mode,'today');
assert.equal(activityModel(today,now).metrics[0].count,1);

const week=empty();
week.articles=[{id:'guide',contentType:'article',approvedAt:'2026-09-08T11:00:00+03:00',status:'approved',visibility:'public'}];
assert.equal(activityModel(week,now).mode,'week');

const guards=empty();
guards.latest=[
  record('same','2026-09-09T08:00:00+03:00'),
  record('same','2026-09-09T08:00:00+03:00'),
  record('future','2026-09-10T08:00:00+03:00'),
  record('invalid','not-a-date'),
  record('pending','2026-09-09T08:00:00+03:00',{status:'pending'}),
  record('private','2026-09-09T08:00:00+03:00',{visibility:'private'}),
  {contentType:'listing',publishedAt:'2026-09-09T08:00:00+03:00',status:'approved',visibility:'public'}
];
assert.equal(activityModel(guards,now).metrics[0].count,1);

const fourGroups=empty();
fourGroups.latest=[record('listing','2026-09-09T08:00:00+03:00')];
fourGroups.publications=[{id:'publication',contentType:'publication',publishedAt:'2026-09-09T08:00:00+03:00'}];
fourGroups.articles=[{id:'article',contentType:'article',publishedAt:'2026-09-09T08:00:00+03:00'}];
fourGroups.events=[{id:'event',contentType:'event',startsAt:'2026-09-09T18:00:00+03:00'}];
assert.equal(activityModel(fourGroups,now).metrics.length,3);

const fallback=activityModel({latest:[{id:'undated',contentType:'listing'}],publications:[],articles:[],events:[]},now);
assert.equal(fallback.mode,'useful');
assert.deepEqual(Array.from(fallback.metrics,item=>item.label),['Обяви и услуги','Полезни статии','Инфо Лом']);
assert(!activityMarkup(fallback).match(/<strong>\d+<\/strong>/));

const dstNow=new Date('2026-03-29T00:30:00Z');
const dst=empty();
dst.latest=[record('dst','2026-03-29T03:15:00+03:00')];
assert.equal(activityModel(dst,dstNow).mode,'today');

console.log('prototype-home-activity-regression-audit: PASS');
