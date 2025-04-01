import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import user from "models/user";

const getHandler = async (req, res) => {
  const username = req.query.username;
  const userFound = await user.findOneByUsername(username);
  return res.status(200).json(userFound);
};

const router = createRouter();
router.get(getHandler);

export default router.handler(controller.errorHandlers);
