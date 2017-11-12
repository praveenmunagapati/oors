export default {
  Query: {
    users: async (_, args, { app, fromMongoCursor }) =>
      fromMongoCursor(await app.modules.get('oors.user').UserRepository.findMany()),
  },
  Mutation: {
    login: async (_, { username, password }, { app, req, fromMongo }) => {
      const { User, UserLoginRepository } = app.modules.get('oors.user');

      const { token, user } = await User.login({ username, password });

      await UserLoginRepository.createOne({
        userId: user._id,
        ip: req.ip,
        browser: req.useragent.browser,
        os: req.useragent.os,
        platform: req.useragent.platform,
      });

      return {
        token,
        user: fromMongo(User.dump(user)),
      };
    },
  },
};
