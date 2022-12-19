import { Flex, Link, Stack, Avatar, Heading, FormControl, InputGroup, InputLeftElement, Input, InputRightElement, Button, FormHelperText, Box, chakra } from "@chakra-ui/react";
import { useForm } from "@hooks/useForm/useForm.hook";
import { useTranslation } from "@libs/i18n/hooks/use-translation";
import { getLoginUserInputSchema } from "@root/yup/schema";
import { useCallback, useState } from "react";
import { FaUserAlt, FaLock } from "react-icons/fa";
import styles from "../register/Register.module.scss";
import { ILoginComponentProps } from "./defs";

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

export const LoginComponent: React.FC<ILoginComponentProps> = ({onSubmit}) => {
    const { register, handleSubmit, getErrorMessage } = useForm({
        schema: getLoginUserInputSchema(),
        
        mode: "all"
    })

    const [showPassword, setShowPassword] = useState(false)

    const handleShowClick = useCallback(() => setShowPassword((p) => !p), [])

    const t = useTranslation()

    return (
        <Flex className={styles.container}>
        <Stack
          flexDir="column"
          mb="2"
          justifyContent="center"
          alignItems="center"
        >
          <Avatar bg="teal.500" />
          <Heading color="teal.400">{t("general.welcome")}</Heading>
          <Box minW={{ base: '90%', md: '468px' }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack
                spacing={4}
                p="1rem"
                backgroundColor="whiteAlpha.900"
                boxShadow="md"
              >
                <FormControl>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      children={<CFaUserAlt color="gray.300" />}
                    />
                    <Input {...register("usernameOrEmail")} 
                     placeholder={t("general.usernameOrEmail")} />
                  </InputGroup>
                </FormControl>
              <h5>{getErrorMessage("usernameOrEmail")}</h5>
                <FormControl>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      color="gray.300"
                      children={<CFaLock color="gray.300" />}
                    />
                    <Input
                    {...register("password")}
                      type={showPassword ? 'text' : 'password'}
                      placeholder={t("general.password")}
                    />
                    <InputRightElement width="4.5rem">
                      <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                        {showPassword ? t('auth.hide') : t('auth.show')}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <FormHelperText textAlign="right">
                    <Link>{t("auth.forgotPassword")}</Link>
                  </FormHelperText>
                </FormControl>
              <h5>{getErrorMessage("password")}</h5>  
                <Button
                  borderRadius={0}
                  type="submit"
                  variant="solid"
                  colorScheme="teal"
                  width="full"
                >
                  {t("auth.login")}
                </Button>
              </Stack>
            </form>
          </Box>
        </Stack>
        <Box>
          {t("auth.doNotHaveAnAccountYet")}
          <Link color="teal.500" href="/register">
            {t("auth.register")}
          </Link>
        </Box>
      </Flex>
    );
    
}