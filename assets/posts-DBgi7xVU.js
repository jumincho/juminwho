import{j as m}from"./vendor-motion-a-hQwyF_.js";import{s as a}from"./index-dg45fqM9.js";function C(){return m.jsx("div",{style:{position:"fixed",inset:0,zIndex:0,background:"#0f0f1a"}})}const f=["전체","AI/개발","연구노트","알고리즘","인사이트","여행","일상"];function p(e){return e==="ko"||e==="en"}function y(e){return f.includes(e)}function d(e){return{slug:e.slug,title:e.title,date:e.date,summary:e.summary,tags:e.tags??[],category:y(e.category)?e.category:"일상",content:e.content,language:p(e.language)?e.language:"ko",source:"remote"}}const c=[{slug:"blog-coming-soon",title:"블로그 오픈 준비 중",date:"2026-03-23",summary:"사이트 기본 구조만 먼저 정리했고, 실제 글과 기록은 추후 작성 예정입니다.",tags:["placeholder","setup"],category:"AI/개발",content:`이 블로그는 현재 템플릿 상태입니다.

실제 글, 정리 노트, 링크 모음은 추후 작성 예정입니다.

- 첫 글 주제 정리
- 카테고리 구성
- 발행 주기 설정

위 항목들은 모두 나중에 업데이트할 예정입니다.`,language:"ko",source:"local"},{slug:"research-note-coming-soon",title:"연구 노트 준비 중",date:"2026-03-23",summary:"논문 정리, 실험 회고, 읽은 자료 메모는 추후 작성 예정입니다.",tags:["research-note","coming-soon"],category:"연구노트",content:`연구 노트 섹션은 아직 비어 있습니다.

다음과 같은 내용이 추후 추가될 예정입니다.

- 읽은 논문 요약
- 실험 설계와 실패 기록
- 구현 과정 메모
- 다음 액션 아이템`,language:"ko",source:"local"},{slug:"research-note-coming-soon-en",title:"Research Notes Coming Soon",date:"2026-03-23",summary:"Paper summaries, experiment logs, and implementation notes will be added later.",tags:["research-note","coming-soon"],category:"연구노트",content:`This blog is currently in template mode.

The research notes section will be filled in later with:

- paper summaries
- experiment retrospectives
- implementation notes
- next steps`,language:"en",source:"local"},{slug:"insight-coming-soon",title:"인사이트 메모 준비 중",date:"2026-03-23",summary:"짧은 생각, 배운 점, 작업 메모는 추후 작성 예정입니다.",tags:["insight","placeholder"],category:"인사이트",content:`짧은 메모와 회고를 담을 공간입니다.

현재는 사이트 구조만 남겨두었고,
실제 내용은 추후 작성 예정입니다.`,language:"ko",source:"local"}];function u(e){return[...e].sort((t,o)=>o.date.localeCompare(t.date))}function h(e,t){const o=c,s=new Map(o.map(r=>[r.slug,r]));return e.forEach(r=>{s.set(r.slug,r)}),u([...s.values()])}function P(e){return c.find(t=>t.slug===e)??null}let n=null;const b=6e4;async function F(e){const t="__all__";if(n&&n.key===t&&Date.now()-n.ts<b)return n.data;const o=l=>l;if(!a){const l=u(o(c));return n={key:t,data:l,ts:Date.now()},l}let s=a.from("posts").select("*").eq("published",!0).order("date",{ascending:!1});const{data:r,error:i}=await s;if(i){console.error("Failed to fetch posts:",i);const l=u(o(c));return n={key:t,data:l,ts:Date.now()},l}const g=h(r.map(d));return n={key:t,data:g,ts:Date.now()},g}async function q(e){const t=P(e);if(!a)return t;const{data:o,error:s}=await a.from("posts").select("*").eq("slug",e).eq("published",!0).single();return s?t||(console.error("Failed to fetch post:",s),null):d(o)}async function I(e){if(!a)return console.error("Failed to create post: Supabase is not configured"),!1;const{error:t}=await a.from("posts").insert({slug:e.slug,title:e.title,date:e.date,summary:e.summary,tags:e.tags,category:e.category,content:e.content,published:!0,language:e.language||"ko"});return t?(console.error("Failed to create post:",t),!1):(n=null,!0)}function L(e,t){return t==="en"?e.replace(/-en$/,""):`${e}-en`}async function T(e){if(!a)return console.error("Failed to delete post: Supabase is not configured"),!1;const{error:t}=await a.from("posts").delete().eq("slug",e);return t?(console.error("Failed to delete post:",t),!1):(n=null,!0)}export{C as I,I as a,q as b,f as c,T as d,L as e,F as g};
