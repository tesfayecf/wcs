'use client'
import React from "react";
import { connect } from "react-redux";
import { IRootState } from "@/app/utils/store/store";
import LoadingPage from "@/app/components/loadingPage/LoadingPage";

interface IProps extends ReturnType<typeof mapStateToProps> {
    children: any;
}

const LoadingState: React.FunctionComponent<IProps> = (props: IProps) => {
    console.log(props.isLoading)
    React.useEffect(() => { }, [props.isLoading])
    // return props.isLoading ? <LoadingPage /> : props.children
    // return props.isLoading ? <>loading</> : <>not loading</>
    // return props.children
    return (
        <>
            <div> {props.isAuth ? <>auth</> : <>not auth</>}</div>
            <div> {props.isLoading ? <>loading</> : <>not loading</>}</div>
        </>
    )
}

function mapStateToProps(state: IRootState) {
    return {
        isLoading: state.app.loadingState.isLoading,
        isAuth: state.app.authenticationState.isAuthenticated
    }
}

export default connect(mapStateToProps, {})(LoadingState)
