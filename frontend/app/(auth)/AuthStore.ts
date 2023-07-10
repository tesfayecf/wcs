import { produce } from "immer";
import { IStore } from "../utils/store/storeTypes";
import { IAuthActions, IAuthStore, ILoginForm, IRegisterForm, IResetPasswordForm } from "./AuthTypes";
import { ISetterProps } from "../app/AppTypes";

export const AuthStoreDefault: IAuthStore = {
    loginForm: {
        email: '',
        emailError: false,
        password: '',
        passwordError: false,
    },
    registerForm: {
        first_name: 'fefasdfadscasdcasdfds',
        first_nameError: false,
        last_name: 'ferfefewfadsfasdf',
        last_nameError: false,
        email: 'adfcfqewfasdx@gmail.com',
        emailError: false,
        password: 'qwertyuiop',
        passwordError: false,
        re_password: 'qwertyuiop',
        re_passwordError: false,
    },
    resetPasswordForm: {
        old_password: '',
        old_passwordError: false,
        password: '',
        passwordError: false,
        re_password: '',
        re_passwordError: false,
    }
}



export function getAuthActions(setLocal: any, getLocal: any): IAuthActions {

    // type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;
    // type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;


    // const setter2 = <T extends UnionToIntersection<IAuthStore[keyof IAuthStore]>>(flag: boolean = false, id: string, ...keys: Array<keyof IAuthStore>[]) => {
    //     return ({ value, set = setLocal, get = getLocal }: ISetterProps<T>) => {
    //         set(produce((state: IStore) => {
    //             keys.forEach((keyArr) => {
    //                 const [firstKey, ...restKeys] = keyArr;
    //                 let nestedObject: any = state.AuthStore.store[firstKey];

    //                 restKeys.forEach((key) => {
    //                     nestedObject[key] = value;
    //                     nestedObject = nestedObject[key] as any;
    //                 });
    //             });
    //             return state;
    //         }), flag, id);
    //     };
    // };

    // const setter = (flag: boolean = false, id: string, ...keys: Array<keyof IAuthStore>) => {
    //     return ({ value, set = setLocal, get = getLocal }: ISetterProps) => {
    //         set(
    //             produce((state: IStore) => {
    //                 keys.reduce((obj, key, index) => {
    //                     if (index === keys.length - 1) {
    //                         obj[key] = value;
    //                     } else {
    //                         if (!obj[key]) {
    //                             obj[key] = {} as any;
    //                         }
    //                         return obj[key];
    //                     }
    //                 }, state.AuthStore.store);
    //                 return state;
    //             }),
    //             flag,
    //             id
    //         );
    //     };
    // };
    /**
     * 
     *  The setter function is a utility function that generates a setter function for updating nested properties in the AuthStore object. Here's an explanation of its behavior:

        The setter function takes the following arguments:

        flag: A boolean flag indicating whether the setter function should trigger reactivity (default: false).
        id: A string identifier for the setter function.
        keys[]: A string array represrign the keys of the path to the nested property in the AuthStore object.
        The returned value of the setter function is another function, which we'll refer to as the "generated setter function".

        The generated setter function accepts an object with the following properties:

        value: The new value to set for the nested property.
        set: The setter function to update the state.
        get: The getter function to retrieve the state.
        When the generated setter function is invoked, it performs the following steps:

        It calls the set function to update the state using the produce function from the immer library.
        Inside the produce callback, it iterates over the provided keys array.
        For each key in the array, it traverses the nested properties of the AuthStore object until it reaches the last key.
        It assigns the value to the last key in the nested property.
        The produce function takes care of immutably updating the state object.
        Finally, it returns the updated state.
        The generated setter function can be used to update nested properties in the AuthStore object. By calling the generated setter function and providing the appropriate arguments, you can set new values for the specified nested properties.
     */

    // type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

    // type KeysPath<T> = T extends [infer First, ...infer Rest] ? [First, ...Rest extends keyof T[number] ? KeysPath<Rest> : never] : [];

    // const setter2 = (flag: boolean, id: string, keys: string[]) => {
    //     return (value: any, set: any, get: any) => {
    //         set(produce((draft: any) => {
    //             keys.reduce((acc: any, key: string, i: number) => {
    //                 if (i === keys.length - 1) {
    //                     acc[key] = value;
    //                 }
    //                 return acc[key];
    //             }, draft);
    //         }), flag, id);
    //     };
    // }

    // const setter = <T extends keyof IAuthStore, Keys extends KeysPath<T>>(
    //     flag: boolean = false,
    //     id: string,
    //     ...keys: [...Keys]
    //   ) => {
    //     return ({ value, set = setLocal, get = getLocal }: ISetterProps) => {
    //       set(
    //         produce((state: IStore) => {
    //           let nestedObject: any = state.AuthStore.store;
    //           keys.forEach((key) => {
    //             nestedObject = nestedObject[key];
    //           });
    //           nestedObject = value;
    //           return state;
    //         }),
    //         flag,
    //         id
    //       );
    //     };
    //   };


    return {
        // Login Form
        setLoginForm: (loginForm: ILoginForm, set: any = setLocal, get: any = getLocal) => {
            set(produce((state: IStore) => {
                state.AuthStore.store.loginForm = loginForm;
                return state;
            }), false, "setLoginForm");
        },
        setLoginFormEmail: (email: string, set: any = setLocal, get: any = getLocal) => {
            set(produce((state: IStore) => {
                state.AuthStore.store.loginForm.email = email;
                return state;
            }), false, "setLoginFormEmail");
        },
        setLoginFormEmailError: (error: boolean, set: any = setLocal, get: any = getLocal) => {
            set(produce((state: IStore) => {
                state.AuthStore.store.loginForm.emailError = error;
                return state;
            }), false, "setLoginFormEmail");
        },
        setLoginFormPassword: (password: string, set: any = setLocal, get: any = getLocal) => {
            set(produce((state: IStore) => {
                state.AuthStore.store.loginForm.password = password;
                return state;
            }), false, "setLoginFormPassword");
        },
        setLoginFormPasswordError: (error: boolean, set: any = setLocal, get: any = getLocal) => {
            set(produce((state: IStore) => {
                state.AuthStore.store.loginForm.passwordError = error;
                return state;
            }), false, "setLoginFormPasswordError");
        },

        // Register Form
        setRegisterForm: (registerForm: IRegisterForm, set: any = setLocal, get: any = getLocal) => {
            set(produce((state: IStore) => {
                state.AuthStore.store.registerForm = registerForm;
                return state;
            }), false, "setRegisterForm");
        },
        setRegisterFormFirstName: (first_name: string, set: any = setLocal, get: any = getLocal) => {
            set(produce((state: IStore) => {
                state.AuthStore.store.registerForm.first_name = first_name;
                return state;
            }), false, "setRegisterFormFirstName");
        },
        setRegisterFormFirstNameError: (error: boolean, set: any = setLocal, get: any = getLocal) => {
            set(produce((state: IStore) => {
                state.AuthStore.store.registerForm.first_nameError = error;
                return state;
            }), false, "setRegisterFormFirstNameError");
        },
        setRegisterFormLastName: (last_name: string, set: any = setLocal, get: any = getLocal) => {
            set(produce((state: IStore) => {
                state.AuthStore.store.registerForm.last_name = last_name;
                return state;
            }), false, "setRegisterFormLastName");
        },
        setRegisterFormLastNameError: (error: boolean, set: any = setLocal, get: any = getLocal) => {
            set(produce((state: IStore) => {
                state.AuthStore.store.registerForm.last_nameError = error;
                return state;
            }), false, "setRegisterFormLastNameError");
        },
        setRegisterFormEmail: (email: string, set: any = setLocal, get: any = getLocal) => {
            set(produce((state: IStore) => {
                state.AuthStore.store.registerForm.email = email;
                return state;
            }), false, "setRegisterFormEmail");
        },
        setRegisterFormEmailError: (error: boolean, set: any = setLocal, get: any = getLocal) => {
            set(produce((state: IStore) => {
                state.AuthStore.store.registerForm.emailError = error;
                return state;
            }), false, "setRegisterFormEmailError");
        },
        setRegisterFormPassword: (password: string, set: any = setLocal, get: any = getLocal) => {
            set(produce((state: IStore) => {
                state.AuthStore.store.registerForm.password = password;
                return state;
            }), false, "setRegisterFormPassword");
        },
        setRegisterFormPasswordError: (error: boolean, set: any = setLocal, get: any = getLocal) => {
            set(produce((state: IStore) => {
                state.AuthStore.store.registerForm.passwordError = error;
                return state;
            }), false, "setRegisterFormPasswordError");
        },
        setRegisterFormRePassword: (re_password: string, set: any = setLocal, get: any = getLocal) => {
            set(produce((state: IStore) => {
                state.AuthStore.store.registerForm.re_password = re_password;
                return state;
            }), false, "setRegisterFormRePassword");
        },
        setRegisterFormRePasswordError: (error: boolean, set: any = setLocal, get: any = getLocal) => {
            set(produce((state: IStore) => {
                state.AuthStore.store.registerForm.re_passwordError = error;
                return state;
            }), false, "setRegisterFormRePasswordError");
        },

        // Reset Password Form
        setResetPasswordForm: (resetPasswordForm: IResetPasswordForm, set: any = setLocal, get: any = getLocal) => {
            set(produce((state: IStore) => {
                state.AuthStore.store.resetPasswordForm = resetPasswordForm;
                return state;
            }), false, "setResetPasswordForm");
        },
        setResetPasswordFormOldPassword: (old_password: string, set: any = setLocal, get: any = getLocal) => {
            set(produce((state: IStore) => {
                state.AuthStore.store.resetPasswordForm.old_password = old_password;
                return state;
            }), false, "setResetPasswordFormOldPassword");
        },
        setResetPasswordFormOldPasswordError: (error: boolean, set: any = setLocal, get: any = getLocal) => {
            set(produce((state: IStore) => {
                state.AuthStore.store.resetPasswordForm.old_passwordError = error;
                return state;
            }), false, "setResetPasswordFormOldPasswordError");
        },
        setResetPasswordFormPassword: (password: string, set: any = setLocal, get: any = getLocal) => {
            set(produce((state: IStore) => {
                state.AuthStore.store.resetPasswordForm.password = password;
                return state;
            }), false, "setResetPasswordFormPassword");
        },
        setResetPasswordFormPasswordError: (error: boolean, set: any = setLocal, get: any = getLocal) => {
            set(produce((state: IStore) => {
                state.AuthStore.store.resetPasswordForm.passwordError = error;
                return state;
            }), false, "setResetPasswordFormPasswordError");
        },
        setResetPasswordFormRePassword: (re_password: string, set: any = setLocal, get: any = getLocal) => {
            set(produce((state: IStore) => {
                state.AuthStore.store.resetPasswordForm.re_password = re_password;
                return state;
            }), false, "setResetPasswordFormRePassword");
        },
        setResetPasswordFormRePasswordError: (error: boolean, set: any = setLocal, get: any = getLocal) => {
            set(produce((state: IStore) => {
                state.AuthStore.store.resetPasswordForm.re_passwordError = error;
                return state;
            }), false, "setResetPasswordFormRePasswordError");
        },

        // Utils
        // getUser: async (set: any = setLocal, get: any = getLocal) => {
        //     try {
        //         const response = await fetch('/users/me/');
        //         const user = await response.json();
        //         return user;
        //     } catch (error) {
        //         console.error('Failed to retrieve user:', error);
        //         return undefined;
        //     }
        // },
        // login: async (email: string, password: string, set: any = setLocal, get: any = getLocal) => {
        //     try {
        //         const response = await fetch('/jwt/create/', {
        //             method: 'POST',
        //             body: JSON.stringify({ email, password }),
        //         });
        //         const data = await response.json();
        //         // Process the login response as needed
        //     } catch (error) {
        //         console.error('Failed to login:', error);
        //     }
        // },
        // register: async (first_name: string, last_name: string, email: string, password: string, re_password: string, set: any = setLocal, get: any = getLocal) => {

        // },
        // verify: async (set: any = setLocal, get: any = getLocal) => {
        //     try {
        //         const response = await fetch('/jwt/verify/', {
        //             method: 'POST',
        //         });
        //         // Process the verification response as needed
        //     } catch (error) {
        //         console.error('Failed to verify token:', error);
        //     }
        // },
        // logout: async (set: any = setLocal, get: any = getLocal) => {
        //     try {
        //         const response = await fetch('/logout/', {
        //             method: 'POST',
        //         });
        //         // Process the logout response as needed
        //     } catch (error) {
        //         console.error('Failed to logout:', error);
        //     }
        // },
        // resetPassword: async (email: string, set: any = setLocal, get: any = getLocal) => {
        //     try {
        //         const response = await fetch('/users/reset_password/', {
        //             method: 'POST',
        //             body: JSON.stringify({ email }),
        //         });
        //         // Process the reset password response as needed
        //     } catch (error) {
        //         console.error('Failed to reset password:', error);
        //     }
        // }
    }
}

