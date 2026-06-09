import user from "models/user.js";
import password from "models/password.js";
import { NotFoundError, UnauthorizedError } from "infra/errors.js";

async function getAuthenticateUser(providedEmail, providedPassword) {
  try {
    const storeUser = await findOneByEmail(providedEmail);
    await validatePassword(providedPassword, storeUser.password);
    return storeUser;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw new UnauthorizedError({
        message: "Dados de autenticação não conferem.",
        action: "Verifique se os dados enviados estão corretos.",
      });
    }

    throw error;
  }

  async function findOneByEmail(providedEmail) {
    let storeUser;

    try {
      storeUser = await user.findOneByEmail(providedEmail);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new UnauthorizedError({
          message: "Email não confere.",
          action: "Verifique se esse dado está correto.",
        });
      }
      throw error;
    }
    return storeUser;
  }
}

async function validatePassword(providedPassword, storedPassword) {
  const correctPasswordMatch = await password.compare(
    providedPassword,
    storedPassword,
  );

  if (!correctPasswordMatch) {
    throw new UnauthorizedError({
      message: "Senha não confere.",
      action: "Verifique se esse dado está correto.",
    });
  }
}

const authentication = {
  getAuthenticateUser,
};
export default authentication;
