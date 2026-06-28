const app = require('./app');
const PORT = process.env.PORT || 3734;

app.listen(PORT, () => {
  console.log(`服务器正在运行，端口号: ${PORT}`);
});