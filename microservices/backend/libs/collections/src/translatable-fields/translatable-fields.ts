import {
  Field,
  ObjectType,
  Prop,
  Schema,
} from '@app/collections/collections.decorators';
import { Language } from '@app/i18n/defs';

export function TranslatableField() {
  for (const language of Object.values(Language)) {
    Field(() => String, { nullable: true })(
      TranslatableField.prototype,
      language,
    );

    Prop({ type: String })(TranslatableField.prototype, language);
  }
}

ObjectType()(TranslatableField);
Schema()(TranslatableField);

TranslatableField();

export interface TranslatableField extends Partial<Record<Language, string>> {}
