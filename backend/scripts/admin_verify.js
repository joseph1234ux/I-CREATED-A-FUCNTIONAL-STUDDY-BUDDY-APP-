(async ()=>{
  const base = 'http://localhost:5000';
  const log = console.log;
  try {
    // Login as seeded admin
    const loginResp = await fetch(base + '/api/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'admin@storyteller.com', password: 'admin123' })
    });
    const loginJson = await loginResp.json();
    log('ADMIN_LOGIN', loginResp.status, loginJson.user ? { id: loginJson.user.id, email: loginJson.user.email } : loginJson);
    if (!loginJson.token) return log('ERROR', 'Admin login failed');
    const token = loginJson.token;

    // Admin summary
    const sum = await fetch(base + '/api/stories/admin/summary', { headers: { authorization: 'Bearer ' + token } });
    log('ADMIN_SUMMARY', sum.status, await sum.json());

    // Create draft story
    const title = 'VERIFICATION TEST STORY - ' + Date.now();
    const createResp = await fetch(base + '/api/stories', { method: 'POST', headers: { 'content-type': 'application/json', authorization: 'Bearer ' + token }, body: JSON.stringify({ title, category: 'Test', description: 'Temporary verification story', content: 'Draft content', isPublished: false }) });
    const createJson = await createResp.json();
    log('CREATE_DRAFT', createResp.status, createJson.id || createJson);
    const storyId = createJson.id;
    if (!storyId) throw new Error('Failed to create test story');

    // Verify draft not visible in public list/search/featured
    const publicList = await fetch(base + '/api/stories?search=' + encodeURIComponent('VERIFICATION TEST STORY')).then(r=>r.json());
    log('PUBLIC_SEARCH_AFTER_DRAFT', publicList.total || 0, publicList.stories?.length || 0);

    const featured = await fetch(base + '/api/stories/featured/list').then(r=>r.json());
    log('FEATURED_CONTAINS_TEST', featured.stories.some(s=>s.id===storyId));

    // GET story detail as public (should 404 because not published)
    const publicDetail = await fetch(base + '/api/stories/' + storyId);
    log('PUBLIC_DETAIL_STATUS_FOR_DRAFT', publicDetail.status);

    // Publish the story
    const pub = await fetch(base + '/api/stories/' + storyId, { method: 'PATCH', headers: { 'content-type': 'application/json', authorization: 'Bearer ' + token }, body: JSON.stringify({ isPublished: true }) });
    const pubJson = await pub.json();
    log('PUBLISH_STATUS', pub.status, pubJson.id || pubJson);

    // Verify visible now
    const publicList2 = await fetch(base + '/api/stories?search=' + encodeURIComponent(title)).then(r=>r.json());
    log('PUBLIC_SEARCH_AFTER_PUBLISH', publicList2.total || 0, publicList2.stories?.map(s=>({id:s.id,title:s.title})));

    // Add chapter
    const chap = await fetch(base + '/api/stories/' + storyId + '/chapters', { method: 'POST', headers: { 'content-type': 'application/json', authorization: 'Bearer ' + token }, body: JSON.stringify({ title: 'Chapter 1', content: 'This is chapter 1', chapterNumber: 1 }) });
    const chapJson = await chap.json();
    log('ADD_CHAPTER', chap.status, chapJson.id || chapJson);
    const chapterId = chapJson.id;

    // Edit chapter
    const editChap = await fetch(base + '/api/stories/' + storyId + '/chapters/' + chapterId, { method: 'PATCH', headers: { 'content-type': 'application/json', authorization: 'Bearer ' + token }, body: JSON.stringify({ title: 'Chapter 1 - Edited', content: 'Edited content' }) });
    log('EDIT_CHAPTER_STATUS', editChap.status, await editChap.json());

    // Delete chapter
    const delChap = await fetch(base + '/api/stories/' + storyId + '/chapters/' + chapterId, { method: 'DELETE', headers: { authorization: 'Bearer ' + token } });
    log('DELETE_CHAPTER_STATUS', delChap.status);

    // Unpublish
    const unpub = await fetch(base + '/api/stories/' + storyId, { method: 'PATCH', headers: { 'content-type': 'application/json', authorization: 'Bearer ' + token }, body: JSON.stringify({ isPublished: false }) });
    log('UNPUBLISH_STATUS', unpub.status, await unpub.json());

    // Clean up: delete story
    const del = await fetch(base + '/api/stories/' + storyId, { method: 'DELETE', headers: { authorization: 'Bearer ' + token } });
    log('DELETE_STORY_STATUS', del.status);

    // Poem formatting test: create poem (draft), publish, fetch, then delete
    const poemTitle = 'VERIFICATION TEST POEM - ' + Date.now();
    const poemContent = 'The morning arrives\n\nquietly,\n\nbringing light\nthrough the window.\n';
    const createPoem = await fetch(base + '/api/stories', { method: 'POST', headers: { 'content-type': 'application/json', authorization: 'Bearer ' + token }, body: JSON.stringify({ title: poemTitle, category: 'Poetry', description: 'temp poem', content: poemContent, isPublished: false }) });
    const poemJson = await createPoem.json();
    log('CREATE_POEM_DRAFT', createPoem.status, poemJson.id || poemJson);
    const poemId = poemJson.id;

    // Verify not in public poems
    const poemsPublic = await fetch(base + '/api/stories?genre=Poetry&limit=100').then(r=>r.json());
    log('POEMS_LIST_INCLUDES_TEST_DRAFT', poemsPublic.stories.some(s=>s.id===poemId));

    // Publish poem
    await fetch(base + '/api/stories/' + poemId, { method: 'PATCH', headers: { 'content-type': 'application/json', authorization: 'Bearer ' + token }, body: JSON.stringify({ isPublished: true }) });
    const poemDetail = await fetch(base + '/api/stories/' + poemId).then(r=>r.json());
    log('POEM_CONTENT_RAW', { id: poemId, contentPreview: poemDetail.content.slice(0,200).replace(/\n/g,'\\n') });

    // Cleanup poem
    await fetch(base + '/api/stories/' + poemId, { method: 'DELETE', headers: { authorization: 'Bearer ' + token } });
    log('POEM_DELETED');

    log('VERIFICATION_COMPLETE');

  } catch (e) {
    console.error('ERROR', e.message);
  }
})();
