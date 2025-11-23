import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT_GATEWAY: number;
}

const envsSchema = joi.object({
  PORT_GATEWAY: joi.number().required(),
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
  portGateway: envVars.PORT_GATEWAY,
}
