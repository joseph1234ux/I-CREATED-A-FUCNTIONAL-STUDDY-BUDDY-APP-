const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const router = express.Router(); const prisma = new PrismaClient();
const number = (value) => Number.isSafeInteger(Number(value)) && Number(value) > 0 ? Number(value) : null;
const slugify = (title) => `${title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${Date.now()}`;
const storyData = (body, user) => ({ title: body.title?.trim(), description: body.description || null, content: body.content || null, category: body.category?.trim(), author: body.author?.trim() || user.name, cover: body.cover || null, tags: body.tags || null, status: body.status === 'Completed' ? 'Completed' : 'Ongoing', isPublished: Boolean(body.isPublished), isFeatured: Boolean(body.isFeatured), authorId: user.id, userId: user.id });

router.get('/', async (req, res) => { try { const page=Math.max(1,Number(req.query.page)||1), limit=Math.min(100,Math.max(1,Number(req.query.limit)||24)), where={isPublished:true}; if(req.query.genre&&req.query.genre!=='All') where.category=req.query.genre; if(req.query.search) where.OR=[{title:{contains:req.query.search}},{author:{contains:req.query.search}},{category:{contains:req.query.search}}]; const sort={popular:{totalReaders:'desc'},rating:{rating:'desc'},az:{title:'asc'}}[req.query.sort]||{createdAt:'desc'}; const [stories,total]=await Promise.all([prisma.story.findMany({where,orderBy:sort,skip:(page-1)*limit,take:limit}),prisma.story.count({where})]); res.json({stories,total,page,limit,totalPages:Math.ceil(total/limit)}); } catch(e){res.status(500).json({error:e.message});} });
router.get('/admin/summary', requireAuth, requireAdmin, async (_req,res) => { const [stories,poems,chapters,readers,reads,recent,drafts]=await Promise.all([prisma.story.count({where:{category:{not:'Poetry'}}}),prisma.story.count({where:{category:'Poetry'}}),prisma.chapter.count(),prisma.user.count(),prisma.story.aggregate({_sum:{totalReaders:true}}),prisma.story.findMany({orderBy:{updatedAt:'desc'},take:6}),prisma.story.count({where:{isPublished:false}})]); res.json({stories,poems,chapters,readers,reads:reads._sum.totalReaders||0,recent,drafts}); });
router.get('/admin/content', requireAuth, requireAdmin, async (req, res) => { try { const view = String(req.query.view || 'all'); const where = {}; if (view === 'drafts') where.isPublished = false; if (view === 'published') where.isPublished = true; if (view === 'stories') where.category = { not: 'Poetry' }; if (view === 'poems') where.category = 'Poetry'; const stories = await prisma.story.findMany({ where, include: { chapters: { orderBy: { chapterNumber: 'asc' } } }, orderBy: { updatedAt: 'desc' } }); res.json({ stories }); } catch (e) { res.status(500).json({ error: e.message }); } });
router.get('/admin/content/:id', requireAuth, requireAdmin, async (req, res) => { const id = number(req.params.id); if (!id) return res.status(400).json({ error: 'Invalid story ID.' }); const story = await prisma.story.findUnique({ where: { id }, include: { chapters: { orderBy: { chapterNumber: 'asc' } } } }); if (!story) return res.status(404).json({ error: 'Story not found.' }); res.json(story); });
router.get('/featured/list', async (_req, res) => { try { let stories = await prisma.story.findMany({ where: { isPublished: true, category: { not: 'Poetry' }, isFeatured: true }, orderBy: { updatedAt: 'desc' }, take: 6 }); if (!stories.length) stories = await prisma.story.findMany({ where: { isPublished: true, category: { not: 'Poetry' } }, orderBy: { totalReaders: 'desc' }, take: 6 }); res.json({ stories }); } catch (e) { res.status(500).json({ error: e.message }); } });
router.get('/search', async (req, res) => { try { const q=String(req.query.q||'').trim(), type=String(req.query.type||'all'), genre=String(req.query.genre||''), status=String(req.query.status||''), sort=String(req.query.sort||'popular'); if(!q) return res.json({stories:[],authors:[],total:0}); const where={isPublished:true,OR:[{title:{contains:q}},{author:{contains:q}},{category:{contains:q}},{description:{contains:q}},{tags:{contains:q}}]}; if(genre&&genre!=='All')where.category=genre; if(status&&status!=='All')where.status=status; if(type==='poems')where.category='Poetry'; if(type==='stories')where.category={not:'Poetry'}; const orderBy={popular:{totalReaders:'desc'},rating:{rating:'desc'},newest:{createdAt:'desc'},az:{title:'asc'}}[sort]||{totalReaders:'desc'}; const stories=type==='authors'?[]:await prisma.story.findMany({where,orderBy,take:100}); const authorMatches=await prisma.story.findMany({where:{isPublished:true,author:{contains:q}},select:{author:true},distinct:['author'],take:30}); const authors=authorMatches.map(s=>s.author); res.json({stories,authors,total:stories.length+authors.length}); } catch(e){res.status(500).json({error:e.message});} });
router.get('/:id', async (req,res)=>{ const id=number(req.params.id); if(!id)return res.status(400).json({error:'Invalid story ID.'}); const story=await prisma.story.findUnique({where:{id},include:{chapters:{orderBy:{chapterNumber:'asc'}}}}); if(!story||!story.isPublished)return res.status(404).json({error:'Story not found.'}); res.json(story); });
router.post('/', requireAuth, requireAdmin, async (req,res)=>{ const data=storyData(req.body,req.user); if(!data.title||!data.category)return res.status(400).json({error:'Title and genre are required.'}); const story=await prisma.story.create({data:{slug:slugify(data.title),...data}}); res.status(201).json(story); });
router.patch('/:id', requireAuth, requireAdmin, async (req, res) => {
	const id = number(req.params.id);
	if (!id) return res.status(400).json({ error: 'Invalid story ID.' });

	try {
		const existing = await prisma.story.findUnique({ where: { id } });
		if (!existing) return res.status(404).json({ error: 'Story not found.' });

		// Build update payload only from provided fields to avoid overwriting with nulls
		const allowed = ['title', 'description', 'content', 'category', 'author', 'cover', 'tags', 'status', 'isPublished', 'isFeatured'];
		const payload = {};
		allowed.forEach((key) => {
			if (Object.prototype.hasOwnProperty.call(req.body || {}, key)) {
				if (key === 'isPublished' || key === 'isFeatured') payload[key] = Boolean(req.body[key]);
				else payload[key] = req.body[key];
			}
		});

		// If title changed and slug is not provided, regenerate slug
		if (payload.title && !Object.prototype.hasOwnProperty.call(req.body, 'slug')) {
			payload.slug = `${String(payload.title).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${Date.now()}`;
		}

		const story = await prisma.story.update({ where: { id }, data: payload });
		res.json(story);
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});
router.delete('/:id', requireAuth, requireAdmin, async (req,res)=>{ const id=number(req.params.id); if(!id)return res.status(400).json({error:'Invalid story ID.'}); await prisma.$transaction([prisma.chapter.deleteMany({where:{storyId:id}}),prisma.story.delete({where:{id}})]); res.status(204).end(); });
router.post('/:id/chapters', requireAuth, requireAdmin, async (req,res)=>{ const storyId=number(req.params.id), b=req.body||{}; if(!storyId||!b.title||!b.content||!number(b.chapterNumber)) return res.status(400).json({error:'Chapter number, title, and content are required.'}); const chapter=await prisma.chapter.create({data:{storyId,title:b.title,content:b.content,chapterNumber:Number(b.chapterNumber),readingTime:b.readingTime||'5 min',wordCount:b.content.trim().split(/\s+/).length}}); res.status(201).json(chapter); });
router.patch('/:id/chapters/:chapterId', requireAuth, requireAdmin, async (req,res)=>{ const storyId=number(req.params.id),chapterId=number(req.params.chapterId),b=req.body||{}; if(!storyId||!chapterId)return res.status(400).json({error:'Invalid chapter ID.'}); const existing=await prisma.chapter.findFirst({where:{id:chapterId,storyId}}); if(!existing)return res.status(404).json({error:'Chapter not found.'}); const content=typeof b.content==='string'?b.content:existing.content; const chapter=await prisma.chapter.update({where:{id:chapterId},data:{title:b.title||existing.title,content,chapterNumber:Number(b.chapterNumber)||existing.chapterNumber,readingTime:b.readingTime||existing.readingTime,wordCount:content.trim().split(/\s+/).filter(Boolean).length}}); res.json(chapter); });
router.delete('/:id/chapters/:chapterId', requireAuth, requireAdmin, async (req,res)=>{const storyId=number(req.params.id),chapterId=number(req.params.chapterId); if(!storyId||!chapterId)return res.status(400).json({error:'Invalid chapter ID.'}); const chapter=await prisma.chapter.findFirst({where:{id:chapterId,storyId}}); if(!chapter)return res.status(404).json({error:'Chapter not found.'}); await prisma.chapter.delete({where:{id:chapterId}});res.status(204).end();});
module.exports = router;
