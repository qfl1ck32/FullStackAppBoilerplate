import { LanguageSwitcher } from "@libs/components/language-switcher/LanguageSwitcher.component"
import { Fragment } from "react"

// TODO: why doesn't React.FC add "children" anymore?
export const Layout: React.FC<any> = (props) => {
    return (
        <Fragment>
            <LanguageSwitcher />

            {props.children}
        </Fragment>
    )
}