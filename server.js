const { ApolloServer } = require('apollo-server');
const jwt = require('jsonwebtoken');
const { typeDefs, resolvers } = require('./schema');
require('dotenv').config()

const envOrNull = key => process.env[key] ?? null
const envOrError = (key) => {
  const val = process.env[key]
  if (val && val.length > 0) {
    return val
  }
  throw new MissingEnvironmentVariableError(key)
}

class MissingEnvironmentVariableError extends Error {
  constructor(key) {
    super(`${key} must be provided`)
    this.name = 'MissingEnvironmentVariableError'
  }
}

/**
 * By doing this check so early in the index allows us a few things:
 * - Early exit in case of mistake. No need to wait for a query to see that 
 *  we have a mistake in the DB URL.
 * - Clarity of the code. We don't need to look everywhere so see what we need to
 *  provide
 *
 * I also chose to get rid of the `NODE_ENV` usage because it's usually better
 * to avoid different setups in the code for different envs. It's better to have
 * the same code but with different config at an early stage.
 */
const PORT = envOrNull('PORT') ?? 8000
const JWT_SECRET = envOrError('JWT_SECRET')
/**
 * In the best world, I would inject these from the top to where they are used.
 * But it's a topic for another time. I'll just re-import them where needed.
 */
envOrError('DATABASE')
envOrError('DATABASE_USER')
envOrError('DATABASE_PASSWD')

const getUser = token => {
  try {
    if (token) {
      return jwt.verify(token, JWT_SECRET)
    }
    return null
  } catch (error) {
    return null
  }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        const token = req.get('Authorization') || ''
        return { user: getUser(token.replace('Bearer', ''))}
    },
    introspection: true,
    playground: true
});

server.listen({ port: PORT }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
