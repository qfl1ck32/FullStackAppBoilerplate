import styles from './Register.module.scss';
import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Link,
  Stack,
  chakra,
} from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { FaLock, FaUserAlt } from 'react-icons/fa';

import { useForm } from '@hooks/useForm/useForm.hook';
import { getRegisterUserInputSchema } from '@root/yup/schema';
import { useTranslation } from '@libs/i18n/hooks/use-translation';
import { IRegisterComponentProps } from './defs';

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

export const RegisterComponent: React.FC<IRegisterComponentProps> = ({onSubmit}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleShowClick = useCallback(() => setShowPassword((p) => !p), [])

  const { register, handleSubmit, getErrorMessage } = useForm({
    schema: getRegisterUserInputSchema(),

    mode: "all"
  });

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
        <Heading color="teal.400">Welcome</Heading>
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
                  <Input {...register("firstName")} 
                   placeholder={t("general.firstName")} />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CFaUserAlt color="gray.300" />}
                  />
                  <Input {...register("lastName")} 
                   placeholder={t("general.lastName")} />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CFaUserAlt color="gray.300" />}
                  />
                  <Input {...register("email")} 
                   placeholder={t("general.email")} />
                </InputGroup>
              </FormControl>
              <h5>{getErrorMessage("email")}</h5>
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CFaUserAlt color="gray.300" />}
                  />
                  <Input {...register("username")} 
                   placeholder={t("general.username")} />
                </InputGroup>
              </FormControl>
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
              <Button
                borderRadius={0}
                type="submit"
                variant="solid"
                colorScheme="teal"
                width="full"
              >
                {t("auth.register")}
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
      <Box>
        {t("auth.alreadyHaveAnAccount")}
        <Link color="teal.500" href="/login">
          {t("auth.login")}
        </Link>
      </Box>
    </Flex>
  );
};
