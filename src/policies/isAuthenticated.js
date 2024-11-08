module.exports = async (ctx, next) => {
  ctx.send("mm")
  if (!ctx.state.user) {
    return ctx.unauthorized('You are not authenticated');
  }

  return await next();
};