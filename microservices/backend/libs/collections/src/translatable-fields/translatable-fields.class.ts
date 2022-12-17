import { MixField, MixObjectType, MixProp, MixSchema } from "@app/collections/collections.decorators";
import { Language } from "@app/i18n/defs";

@MixObjectType()
@MixSchema()
export class TranslatableField {
    @MixField(() => String, { nullable: true })
    @MixProp()
    [Language.ro]?: string

    @MixField(() => String, { nullable: true })
    @MixProp()
    [Language.en]?: string;
}
