import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT_SERVICE1: number;
}

const envsSchema = joi.object({
  PORT_SERVICE1: joi.number().required(),
})
  .unknown(true);

const { error, value } = envsSchema.validate({
  ...process.env,
});


if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;


export const envs = {
  portService1: envVars.PORT_SERVICE1,
}
