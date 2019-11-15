const Koa = require('koa');
const render = require('koa-art-template');
const  router =require("koa-router")();
const path = require('path');
const static = require('koa-static');

const app = new Koa();
render(app, {
  root: path.join(__dirname, 'view'),
  extname: '.html',
  debug: process.env.NODE_ENV !== 'production'
});
app.use(static('./static'));
router.get('/:category' , async function (ctx) {
  if(ctx.params =='{}'){
    await ctx.render('index');
  }else{
      await ctx.render(ctx.params.category);
   
  }
});
// router.get('/' , async function (ctx) {
//   console.log(ctx.params)

//   await ctx.render('index');
// });
// router.get('/about' , async function (ctx) {
//   console.log(ctx.params)
//   await ctx.render('about');
// });
// router.get('/blog-post.html' , async function (ctx) {
//   await ctx.render('blogPost');
// });

// router.get('/blog-list.html' , async function (ctx) {
//   await ctx.render('blog-list');
// });
// router.get('/index.html' , async function (ctx) {
//   await ctx.render('index');
// });


app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000, () => {
  console.log('This server is running at http://localhost:' + 3000)
})