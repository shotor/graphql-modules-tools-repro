export const resolvers = {
  Query: {
    userWithError: async () => {
      return {
        id: "1",
        email: "email",
      };
    },
    userWithoutError: async () => {
      return {
        id: "1",
        email: "email",
      };
    },
  },
};
