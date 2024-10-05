import { store } from "@/store/store";
import { TypedUseSelectorHook, useSelector } from "react-redux";

export const useAppSelector: TypedUseSelectorHook<ReturnType<typeof store.getState>> = useSelector