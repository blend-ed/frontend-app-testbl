import { gql, useQuery } from "@apollo/client";
import { useContext, useEffect, useState } from "react";
import { SubOrgContext } from "../context/Context";

const FEATURE_TOGGLE = gql`
query featureToggle($_eq: String) {
	features(where: {features_sub_org: {name: {_eq: $_eq}}}) {
      id  
	  enabled_feature
	}
  }  
`;

const useFeatures = () => {
    const ConfigContext = useContext(SubOrgContext)
	const sub_org_name = 'localhost'
    const [features, setFeatures] = useState([]);
    const [featuresList, setFeaturesList] = useState({});

    const { data, loading: featuresLoading, refetch } = useQuery(FEATURE_TOGGLE, {
        variables: { _eq: sub_org_name },
    });

    useEffect(() => {
        if (data) {
            setFeatures(data.features.map(feature => feature.enabled_feature.toLowerCase()))
            let featuresList = {};
            data.features.forEach(feature => {
                featuresList[feature.enabled_feature] = feature.id;
            });
            setFeaturesList(featuresList);
        }
    }, [data]);

    return { features, featuresLoading, featuresList, refetch };
}

export default useFeatures;