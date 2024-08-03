import { useLocalStorage } from "@uidotdev/usehooks";
import { Skeleton } from "./ui/skeleton";
import getVerseTranslations from "@/utils/getVerseTranslations";

function Translations({
  translations,
}: {
  translations?: Awaited<ReturnType<typeof getVerseTranslations>>;
}) {
  const [translation_ids] = useLocalStorage("translation_ids", [20]);
  return (
    <>
      <div className="text-xl">
        {translations?.length ? (
          translation_ids
            .map((id) => translations.filter((t) => t.id == id)[0])
            .map((translation) => {
              return (
                <>
                  <div key={translation?.resource_id}>
                    {translation?.text.replaceAll(/<sup.*>.*<\/sup>/g, "")}
                  </div>
                  <div className="text-gray-500 text-xs">
                    {"— "}
                    {translation?.name}
                  </div>
                </>
              );
            })
        ) : (
          <>
            <Skeleton className="w-[64vw] h-[45px] rounded-full" />
          </>
        )}
      </div>
    </>
  );
}

export default Translations;
