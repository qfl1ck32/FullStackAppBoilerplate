import { Field, ObjectType, Prop, Schema } from "@app/collections/collections.decorators";
import { Language } from "@app/i18n/defs";

@ObjectType()
@Schema()
export class TranslatableField {
    @Field(() => String, { nullable: true })
    @Prop()
    [Language.ro]?: string

    @Field(() => String, { nullable: true })
    @Prop()
    [Language.en]?: string;
}
