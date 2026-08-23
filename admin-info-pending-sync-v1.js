(() => {
  "use strict";

  let client = null;
  let currentUser = null;
  let pendingCount = 0;
  let refreshTimer = 0;

  async function getClient(){
    if(window.PopitaiSupabase) return window.PopitaiSupabase;
    return new Promise((resolve,reject)=>{
      let tries = 0;
      const timer = setInterval(()=>{
        tries += 1;
        if(window.PopitaiSupabase){
          clearInterval(timer);
          resolve(window.PopitaiSupabase);
        }else if(tries >= 100){
          clearInterval(timer);
          reject(new Error("Supabase client timeout"));
        }
      },50);
    });
  }

  async function isAllowedAdmin(){
    client = client || await getClient();
    const {data:userData,error:userError} = await client.auth.getUser();
    if(userError) throw userError;
    currentUser = userData?.user || null;
    if(!currentUser) return false;
    const {data:profile,error:profileError} = await client.from("profiles")
      .select("role,is_blocked")
      .eq("id",currentUser.id)
      .maybeSingle();
    if(profileError) throw profileError;
    return profile?.role === "admin" && profile?.is_blocked !== true;
  }

  function ensureReviewShortcut(){
    const reviewGroup = document.querySelector('.admin-menu [data-admin-menu-group-items="review"]');
    if(!reviewGroup) return null;

    let button = reviewGroup.querySelector("[data-info-review-shortcut]");
    if(!button){
      button = document.createElement("button");
      button.type = "button";
      button.dataset.infoReviewShortcut = "1";
      button.addEventListener("click",()=>{
        document.querySelector(".admin-menu [data-info-admin]")?.click();
      });
      reviewGroup.appendChild(button);
    }
    return button;
  }

  function applyLabel(){
    const contentButton = document.querySelector(".admin-menu [data-info-admin]");
    if(!contentButton) return false;

    contentButton.textContent = "Инфо Лом";
    contentButton.dataset.infoPendingLabel = "1";

    const reviewButton = ensureReviewShortcut();
    if(reviewButton){
      reviewButton.innerHTML = `Инфо Лом <span class="admin-badge" data-info-review-badge>${pendingCount}</span>`;
      reviewButton.hidden = pendingCount <= 0;
    }
    return true;
  }

  async function refreshCount(){
    try{
      if(!(await isAllowedAdmin())) return;
      const [{count:submissions,error:submissionsError},{count:reports,error:reportsError}] = await Promise.all([
        client.from("info_submissions").select("id",{count:"exact",head:true}).eq("status","pending"),
        client.from("info_error_reports").select("id",{count:"exact",head:true}).eq("status","pending")
      ]);
      if(submissionsError) throw submissionsError;
      if(reportsError) throw reportsError;
      pendingCount = (submissions || 0) + (reports || 0);
      applyLabel();
    }catch(error){
      console.warn("Info Lom pending sync",error);
    }
  }

  function scheduleRefresh(delay = 250){
    clearTimeout(refreshTimer);
    refreshTimer = window.setTimeout(refreshCount,delay);
  }

  function syncAfterMenuSettles(){
    const menu = document.querySelector(".admin-menu");
    if(!menu){
      scheduleRefresh(400);
      return;
    }

    let quietTimer = 0;
    const observer = new MutationObserver(()=>{
      clearTimeout(quietTimer);
      quietTimer = window.setTimeout(()=>{
        applyLabel();
        observer.disconnect();
      },180);
    });
    observer.observe(menu,{childList:true,subtree:true});

    window.setTimeout(()=>{
      observer.disconnect();
      applyLabel();
    },2200);
  }

  document.addEventListener("click",event=>{
    if(!event.target?.closest?.("[data-sub-return],[data-sub-reject],[data-approve-add],[data-apply-correction],[data-report-return],[data-report-reject],[data-resolve-report]")) return;
    scheduleRefresh(900);
  },true);

  document.addEventListener("DOMContentLoaded",async()=>{
    await refreshCount();
    syncAfterMenuSettles();
  },{once:true});
})();
