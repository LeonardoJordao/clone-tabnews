import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import user from "models/user.js";

const postHandler = async (req, res) => {
  const userInputValues = req.body;
  const newUser = await user.create(userInputValues);
  return res.status(201).json(newUser);
};

const router = createRouter();
router.post(postHandler);

export default router.handler(controller.errorHandlers);
