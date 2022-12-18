import {
  Field,
  ObjectType,
  Prop,
  Schema,
} from '@app/collections/collections.decorators';
import { Language } from '@app/i18n/defs';

import { Combine } from '../collections';

// @ObjectType()
// @Schema()
// export class TranslatableField {
//     @Field(() => String, { nullable: true })
//     @Prop()
//     [Language.ro]?: string

//     @Field(() => String, { nullable: true })
//     @Prop()
//     [Language.en]?: string;
// }

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

const f = TranslatableField();

export interface TranslatableField extends Partial<Record<Language, string>> {}
