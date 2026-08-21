(async ()=>{
  const base='http://localhost:5000';
  const log=console.log;
  try{
    // Admin login
    const login=await fetch(base+'/api/auth/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email:'admin@storyteller.com',password:'admin123'})});
    const lj=await login.json(); if(!lj.token) return log('ADMIN_LOGIN_FAILED',lj);
    const token=lj.token;
    // Check story 50
    const id=50;
    let det=await fetch(base+'/api/stories/'+id);
    log('PUBLIC_DETAIL_STATUS',det.status);
    let dj=null; if(det.status===200) dj=await det.json(); else log('PUBLIC_DETAIL_BODY',await det.text());
    // If not published, publish it
    const pubResp=await fetch(base+'/api/stories/'+id,{method:'PATCH',headers:{'content-type':'application/json','authorization':'Bearer '+token},body:JSON.stringify({isPublished:true})});
    log('PUBLISH_POEM_STATUS',pubResp.status,await pubResp.text());
    // Fetch detail now
    const det2=await fetch(base+'/api/stories/'+id); log('PUBLIC_DETAIL_AFTER_PUBLISH_STATUS',det2.status); if(det2.status===200){ const d2=await det2.json(); log('POEM_CONTENT_ESCAPED', d2.content.replace(/\n/g,'\\n')); } else { log('PUBLIC_DETAIL_AFTER_PUBLISH_BODY', await det2.text()); }
    // Delete poem
    const del=await fetch(base+'/api/stories/'+id,{method:'DELETE',headers:{'authorization':'Bearer '+token}}); log('DELETE_POEM_STATUS',del.status);
    // Verify normal user cannot access admin/summary
    const reg=await fetch(base+'/api/auth/register',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email:'normaltester@example.com',password:'Password123!',name:'Normal Tester'})}); const regj=await reg.json(); const userToken=regj.token; const adminSummaryAsUser=await fetch(base+'/api/stories/admin/summary',{headers:{authorization:'Bearer '+userToken}}); log('ADMIN_SUMMARY_AS_USER_STATUS', adminSummaryAsUser.status, await adminSummaryAsUser.text());
  }catch(e){console.error('ERR',e.message);} })();
