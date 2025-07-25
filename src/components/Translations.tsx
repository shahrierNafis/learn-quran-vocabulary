import { Skeleton } from "./ui/skeleton";
import getVerseTranslations from "@/utils/getVerseTranslations";
import { useOnlineStorage } from "@/stores/onlineStorage";
import { useShallow } from "zustand/react/shallow";

function Translations({
  translations,
  index,
}: {
  translations?: Awaited<ReturnType<typeof getVerseTranslations>>;
  index: string;
}) {
  const [translation_ids] = useOnlineStorage(
    useShallow((a) => [a.translation_ids])
  );
  return (
    <>
      {translation_ids.length ? (
        <div className="text-xl">
          {translations?.length ? (
            translation_ids
              .map((id) => translations.filter((t) => t.id == +id)[0])
              .map((translation) => {
                return (
                  <>
                    <div key={index + translation?.id}>
                      {translation?.text.replaceAll(/<sup.*?>.*?<\/sup>/g, "")}
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
      ) : (
        <></>
      )}
    </>
  );
}

export default Translations;
