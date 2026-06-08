import { useEffect, useState } from "react";

import {
  getAllDistrictsByProvince,
  getAllProvinces,
  getAllWardsByDistrict,
  getShippingAccountsByUser,
} from "@/src/utils/api";

export default function useLocationSelector(
  initialProvinceId: number | null = null,
  initialDistrictId: number | null = null,
  initialWardCode: string = "",
) {
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);

  const [provinceId, setProvinceId] = useState<number | null>(initialProvinceId);
  const [districtId, setDistrictId] = useState<number | null>(initialDistrictId);
  const [wardCode, setWardCode] = useState<string>(initialWardCode);

  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  const [provinceSearch, setProvinceSearch] = useState("");
  const [districtSearch, setDistrictSearch] = useState("");
  const [wardSearch, setWardSearch] = useState("");

  const [error, setError] = useState("");

  // Fetch provinces
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setLoadingProvinces(true);
        const accountsResponse = await getShippingAccountsByUser();
        if (
          !accountsResponse ||
          !accountsResponse.data ||
          accountsResponse.data.length === 0
        ) {
          setError(
            "No shipping accounts found. Please add a shipping account first.",
          );
          setLoadingProvinces(false);
          return;
        }

        const defaultAccount =
          accountsResponse.data.find((acc: any) => acc.is_default) ||
          accountsResponse.data[0];
        const response: any = await getAllProvinces(defaultAccount.token);

        if (response.code === 200) {
          setProvinces(
            response.data.map((province: any) => ({
              id: province.ProvinceID,
              name: province.ProvinceName,
              code: province.Code,
            })),
          );
        } else {
          setError("Failed to load provinces");
        }
      } catch (err) {
        console.error("Error fetching provinces:", err);
        setError("Error loading provinces. Please try again.");
      } finally {
        setLoadingProvinces(false);
      }
    };
    fetchProvinces();
  }, []);

  // Fetch districts when province changes
  useEffect(() => {
    const fetchDistricts = async () => {
      if (!provinceId) return;

      try {
        setLoadingDistricts(true);
        setDistricts([]);

        const accountsResponse = await getShippingAccountsByUser();
        if (
          !accountsResponse ||
          !accountsResponse.data ||
          accountsResponse.data.length === 0
        ) {
          setLoadingDistricts(false);
          return;
        }

        const defaultAccount =
          accountsResponse.data.find((acc: any) => acc.is_default) ||
          accountsResponse.data[0];

        const response: any = await getAllDistrictsByProvince(
          provinceId,
          defaultAccount.token,
        );

        if (response.code === 200) {
          setDistricts(
            response.data.map((district: any) => ({
              id: district.DistrictID,
              name: district.DistrictName,
              province_id: provinceId,
            })),
          );
        }
      } catch (err) {
        console.error("Error fetching districts:", err);
      } finally {
        setLoadingDistricts(false);
      }
    };
    fetchDistricts();
  }, [provinceId]);

  // Fetch wards when district changes
  useEffect(() => {
    const fetchWards = async () => {
      if (!districtId) return;

      try {
        setLoadingWards(true);
        setWards([]);

        const accountsResponse = await getShippingAccountsByUser();
        if (
          !accountsResponse ||
          !accountsResponse.data ||
          accountsResponse.data.length === 0
        ) {
          setLoadingWards(false);
          return;
        }

        const defaultAccount =
          accountsResponse.data.find((acc: any) => acc.is_default) ||
          accountsResponse.data[0];

        const response: any = await getAllWardsByDistrict(
          districtId,
          defaultAccount.token,
        );

        if (response.code === 200) {
          setWards(
            response.data.map((ward: any) => ({
              code: ward.WardCode,
              name: ward.WardName,
              district_id: districtId,
            })),
          );
        }
      } catch (err) {
        console.error("Error fetching wards:", err);
      } finally {
        setLoadingWards(false);
      }
    };
    fetchWards();
  }, [districtId]);

  return {
    provinces,
    districts,
    wards,
    provinceId,
    setProvinceId,
    districtId,
    setDistrictId,
    wardCode,
    setWardCode,
    loadingProvinces,
    loadingDistricts,
    loadingWards,
    provinceSearch,
    setProvinceSearch,
    districtSearch,
    setDistrictSearch,
    wardSearch,
    setWardSearch,
    error,
  };
}
