const Koa = require('koa');
const render = require('koa-art-template');
const router = require("koa-router")();
const path = require('path');
const static = require('koa-static');
const koaBody = require('koa-body');
const fs = require('fs');
const send = require('koa-send');

const app = new Koa();
render(app, {
  root: path.join(__dirname, 'view'),
  extname: '.html',
  debug: process.env.NODE_ENV !== 'production'
});
app.use(koaBody({
  multipart: true,
  formidable: {
    maxFileSize: 200 * 1024 * 1024    // 设置上传文件大小最大限制，默认2M
  }
}));
app.use(static('./static'));

router.get('/', async function (ctx) {
  await ctx.render('home');

});
router.post('/uploadfile', async (ctx, next) => {
  // 上传单个文件
  const file = ctx.request.files.file; // 获取上传文件
  console.log(ctx) 
  // 创建可读流
  const reader = fs.createReadStream(file.path);

  console.log(__dirname)
  let filePath = path.join(__dirname, 'upload/') + `/${file.name}`;
  // 创建可写流 \koa2\public\upload\uexEMM-android-4.4.45.zip
  const upStream = fs.createWriteStream(filePath);
  // 可读流通过管道写入可写流
  reader.pipe(upStream);
  return ctx.body = "上传成功！";
});
router.get('/download/:name', async function (ctx){

  console.log('------------')

  const name = ctx.params.name;
  const path = `upload/${name}`;
  ctx.attachment(path);
   await send(ctx, path);
 })
 //test 
 router.post('/test', async function (ctx) {
        console.log('test=========')
          let postData = ctx.request.body;

        console.log(postData)
    ctx.response.body = {status:200,msg:'这是post测试的返回数据',data:postData};

});
router.get('/:category', async function (ctx) {
  console.log('------------')

  if (ctx.params == '{}') {
    await ctx.render('home');
  } else {
    await ctx.render(ctx.params.category);
  }
});
router.get('/:category/:rotate', async function (ctx) {
  var pathSelf = ""
  for(let key  in ctx.params){
    pathSelf+= ctx.params[key]+"/"
}
  if (ctx.params == '{}') {
    await ctx.render('home');
  } else {
    await ctx.render( pathSelf);
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