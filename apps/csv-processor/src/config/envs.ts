import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
    PORT_CSV_PROCESSOR: number;
}

const envsSchema = joi.object({
    PORT_CSV_PROCESSOR: joi.number().required(),
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
    port: envVars.PORT_CSV_PROCESSOR,
};
