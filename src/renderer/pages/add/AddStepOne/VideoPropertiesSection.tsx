import { useShallow } from "zustand/react/shallow"
import { useAddModalStore } from "../../../stores/useAddModalStore"
import { AddModalField, AddModalFieldInputWrapper, AddModalFieldLabel, AddModalHeader, AddModalSection } from "../../../components/ui/add-modal";
import { useAccidentsStore } from "../../../stores/useAccidentsStore";
import { useMutation } from "react-query";
import { RiFolderLine, RiTimeLine } from "@remixicon/react";
import TimeInput from "../../../components/TimeInput";

export default function VideoPropertiesSection() {
  const findAccident = useAccidentsStore((state) => state.findAccident);
  const [
    filePath,
    updateFile,
    accidentName,
    setAccidentName,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    videoRef
  ] = useAddModalStore(
    useShallow((state) => [
      state.filePath,
      state.updateFile,
      state.accidentName,
      state.setAccidentName,
      state.startTime,
      state.setStartTime,
      state.endTime,
      state.setEndTime,
      state.videoRef,
    ])
  );

  const findAccidentMutation = useMutation(findAccident, {
    onSuccess: async (filePath) => {
      if (filePath) {
        updateFile(filePath);
      }
    },
  });
  

  return (
    <AddModalSection className="w-80 border-r">
      <AddModalHeader>Video Properties</AddModalHeader>

      <AddModalField>
        <AddModalFieldLabel hasAsterisk htmlFor="videoName">Name</AddModalFieldLabel>

        <AddModalFieldInputWrapper htmlFor="videoName">
          <input
            id="videoName"
            type="text" 
            className="w-full bg-transparent placeholder-gray-400"
            placeholder="Enter video name"
            value={accidentName}
            onChange={(e) => setAccidentName(e.target.value)}
          />
        </AddModalFieldInputWrapper>
      </AddModalField>

      <AddModalField>
        <AddModalFieldLabel htmlFor="filePath">File</AddModalFieldLabel>

        <AddModalFieldInputWrapper htmlFor="filePath" className="cursor-pointer" title={filePath}>
          <RiFolderLine className="min-w-[1.125rem] min-h-[1.125rem]" />
          <span className="whitespace-nowrap overflow-hidden overflow-ellipsis">{filePath}</span>
          <button id="filePath" type="button" className="hidden" onClick={() => findAccidentMutation.mutate()} />
        </AddModalFieldInputWrapper>
      </AddModalField>

      <AddModalField>
        <AddModalFieldLabel>Start Time</AddModalFieldLabel>

        <AddModalFieldInputWrapper>
          <RiTimeLine size={18} />
          <TimeInput 
            time={startTime} setTime={setStartTime} maxTime={endTime} />
        </AddModalFieldInputWrapper>
      </AddModalField>

      <AddModalField>
        <AddModalFieldLabel>End Time</AddModalFieldLabel>

        <AddModalFieldInputWrapper>
          <RiTimeLine size={18} />
          <TimeInput time={endTime} setTime={setEndTime} maxTime={videoRef.current?.duration ?? endTime} />
        </AddModalFieldInputWrapper>
      </AddModalField>
    </AddModalSection>
  )
}