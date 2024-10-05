import { store } from "@/store/store";
import { useDispatch } from "react-redux";

export const useAppDispatch: () => typeof store.dispatch = useDispatch