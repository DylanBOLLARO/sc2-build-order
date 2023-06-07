import { useRouter } from "next/router";
import React from "react";
import LayoutSettings from "../../components/settings/LayoutSettings";
import { Text } from "@nextui-org/react";

function ViewAndChange() {
  const router = useRouter();
  const { query } = useRouter();

  return (
    <div className="m-0 min-h-screen bg-white p-0">
      <LayoutSettings>
        <Text
          h1
          size={60}
          css={{
            textGradient: "45deg, $blue600 -20%, $pink600 50%",
          }}
          weight="bold"
        >
          {query.selectedCategories}
        </Text>
        <button
          onClick={() => {
            router.push({
              pathname: "/settings",
              query: { selected: query.selectedCategories },
            });
          }}
        >
          back
        </button>
      </LayoutSettings>
    </div>
  );
}

export default ViewAndChange;
