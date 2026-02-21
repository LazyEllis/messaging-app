import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../lib/api";

export const useProfile = () =>
  useQuery({
    queryFn: getProfile,
    queryKey: ["user"],
  });
