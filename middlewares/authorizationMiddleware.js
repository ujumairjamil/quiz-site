/** Prevent anonymous users from accessing privileged routes. */
const authorizationMiddleware = async ({ request, response, state }, next) => {
  const user = await state.session.get('user');
  if (!user) {
    if (!(
      request.url.pathname === '/'
      || request.url.pathname.startsWith('/auth')
      || request.url.pathname.startsWith('/api')
    )) {
      response.redirect('/auth/login');
      return;
    }
  }
  await next();
};

export { authorizationMiddleware };