import { useStore } from "../store/store";

class AppHandler {
    private static instance: AppHandler;
    private constructor() {
        console.log("Dashboard handler constructor");
    }

    public static getInstance(): AppHandler {
        if (!AppHandler.instance) {
            AppHandler.instance = new AppHandler();
        }

        console.log("Dashboard handler getInstance()");
        return AppHandler.instance;
    }

    public init(): void {
        // Get initial dasboard data 
        console.log("Initialising dashboard...");
    }

    public setInitialAppInfo() {
        useStore.setState((state) => ({
            AppStore: {
                checkValue: -1,
                userInfo: dummyUserInfo
            }
        }));
        return useStore.getState().AppStore;
    }
}

export default AppHandler;

const dummyUserInfo = {
    id: 1,
    name: "John Doe",
    email: "john@gmail.com",
    role: "Admin",
    status: "Active",
    lastLogin: "1 hour ago",
    avatar: "https://via.placeholder.com/150"
}