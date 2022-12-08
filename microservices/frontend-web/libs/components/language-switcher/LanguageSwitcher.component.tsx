import { Select } from "@chakra-ui/react"
import { use } from "@libs/di/hooks/use"
import { I18NService } from "@libs/i18n/i18n.service"
import { Language } from "@root/gql/operations"
import { useRouter } from "next/router"
import { ChangeEventHandler, useCallback, useState } from "react"

export const LanguageSwitcher: React.FC = () => {
    const i18nService = use(I18NService)
    
    const router = useRouter()

    const { pathname, query, asPath, locale } = router

    const [language, setLanguage] = useState(locale)

    const onChange: ChangeEventHandler<HTMLSelectElement> = useCallback((event) => {
        const locale = event.target.value as Language

        i18nService.onLanguageChange(locale)

        router.push({pathname, query}, asPath, { locale })

        setLanguage(locale)
    }, [])

    return (
        <Select value={language} onChange={onChange} variant="filled">
            {Object.values(Language).map(language => (
                <option key={language} value={language}>{language}</option>
            ))}
        </Select>
    )
}
