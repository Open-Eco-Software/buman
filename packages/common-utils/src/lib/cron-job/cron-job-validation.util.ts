import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'cron', async: false })
export class CronValidationConstraint implements ValidatorConstraintInterface {
    validate(cronInterval: string) {
        const pattern =
            /^(\*|(\*\/[1-9][0-9]*)|([0-9]+(\-[0-9]+)?(,[0-9]+(\-[0-9]+)?)*)|(([0-9]+(\-[0-9]+)?(,[0-9]+(\-[0-9]+)?)*)\/[1-9][0-9]*)){5}$/;

        return pattern.test(cronInterval);
    }

    defaultMessage() {
        return 'Invalid cron job interval format';
    }
}
