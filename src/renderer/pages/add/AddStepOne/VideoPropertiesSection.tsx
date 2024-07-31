import { useShallow } from "zustand/react/shallow"
import { useAddModalStore } from "../../../stores/useAddModalStore"
import { AddModalField, AddModalFieldInputWrapper, AddModalFieldLabel, AddModalHeader, AddModalSection } from "../../../components/ui/add-modal";
import { useAccidentsStore } from "../../../stores/useAccidentsStore";
import { useMutation } from "react-query";
import { RiFolderLine, RiTimeLine } from "@remixicon/react";

export default function VideoPropertiesSection() {
  const findAccident = useAccidentsStore((state) => state.findAccident);
  const [
    fileName,
    setFileName,
    accidentName,
    setAccidentName,
  ] = useAddModalStore(
    useShallow((state) => [
      state.fileName,
      state.setFileName,
      state.accidentName,
      state.setAccidentName
    ])
  );

  const findAccidentMutation = useMutation(findAccident, {
    onSuccess: async (fileName) => {
      if (fileName) {
        setFileName(fileName);
      }
    },
  });
  

  return (
    <AddModalSection className="w-80 border-r">
      <AddModalHeader>Video Properties</AddModalHeader>

      <AddModalField>
        <AddModalFieldLabel htmlFor="videoName">Name</AddModalFieldLabel>

        <AddModalFieldInputWrapper htmlFor="videoName">
          <input
            id="videoName"
            type="text" 
            className="w-full bg-transparent placeholder-gray-300 focus:outline-none"
            placeholder="Enter video name"
            value={accidentName}
            onChange={(e) => setAccidentName(e.target.value)}
          />
        </AddModalFieldInputWrapper>
      </AddModalField>

      <AddModalField>
        <AddModalFieldLabel htmlFor="fileName">File</AddModalFieldLabel>

        <AddModalFieldInputWrapper htmlFor="fileName" className="cursor-pointer" title={fileName}>
          <RiFolderLine className="min-w-[1.125rem] min-h-[1.125rem]" />
          <span className="whitespace-nowrap overflow-hidden overflow-ellipsis">{fileName}</span>
          <button id="fileName" className="hidden" onClick={() => findAccidentMutation.mutate()} />
        </AddModalFieldInputWrapper>
      </AddModalField>

      <AddModalField>
        <AddModalFieldLabel>Duration</AddModalFieldLabel>

        <p>40s</p>
      </AddModalField>

      <AddModalField>
        <AddModalFieldLabel>Start Time</AddModalFieldLabel>

        <AddModalFieldInputWrapper>
          <RiTimeLine size={18} />
        </AddModalFieldInputWrapper>
      </AddModalField>

      <AddModalField>
        <AddModalFieldLabel>End Time</AddModalFieldLabel>

        <AddModalFieldInputWrapper>
          <RiTimeLine size={18} />
        </AddModalFieldInputWrapper>
      </AddModalField>
    </AddModalSection>
  )
}