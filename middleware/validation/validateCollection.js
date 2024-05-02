const Joi = require('joi');
const handleJoiError = require('../../utils/joiErrorHandler');

const validateCollection = (req, res, next) => {
  const itemSchema = Joi.object({
    _id: Joi.string().optional(),
    name: Joi.string().optional().label('Name'),
    description: Joi.string().optional().label('Description'),
    price: Joi.number().optional().label('Price'),
    imgUrl: Joi.string().optional().label('Image URL'),
    collection: Joi.string().optional().label('Collection'),
    createdBy: Joi.string().optional().label('Created By'),
    idx: Joi.number().optional(),
  });

  const schema = Joi.object({
    _id: Joi.string().optional(),
    name: Joi.string()
      .regex(/^[a-zA-Z\s]*$/)
      .min(2)
      .max(60)
      .required()
      .label('Collection name'),

    description: Joi.string().required().label('Collection description'),
    items: Joi.array().items(itemSchema).optional().label('Items array'), // Corrected "collections" to "items" here
    isCustom: Joi.boolean().optional(),
    __v: Joi.number().optional(),
  });

  const { error } = schema.validate(req.body);
  error ? handleJoiError(error) : next();
};

module.exports = validateCollection;
