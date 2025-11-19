"use client";

import * as React from "react";
import { X, Edit3, Loader2, GripVertical, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/hooks/useToast";
import type { ButtonData, ButtonCommand, ButtonType } from "../types";

interface ButtonAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  buttonData?: ButtonData;
  onSave?: () => void;
}

const FormField = ({
  label,
  value,
  editable = false,
  width = "w-[272px]",
  className = "",
  onChange,
}: {
  label: string;
  value: string;
  editable?: boolean;
  width?: string;
  className?: string;
  onChange?: (value: string) => void;
}) => (
  <div className="flex items-center w-full h-11 max-sm:flex-col max-sm:gap-2 max-sm:items-start max-sm:h-auto">
    <div className="text-base leading-6 text-neutral-700 w-[120px] max-sm:w-full">
      {label}
    </div>
    <div
      className={`flex items-center ${
        editable
          ? "p-2 border-b border-solid border-b-neutral-500"
          : "px-2 py-3"
      } min-w-60 ${width} max-sm:w-full max-sm:min-w-[auto] ${className}`}
    >
      {editable && onChange ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 text-base leading-6 text-neutral-500 bg-transparent border-none outline-none"
        />
      ) : (
        <div
          className={`flex-1 text-base leading-6 ${
            editable ? "text-neutral-500" : "text-zinc-400"
          }`}
        >
          {value}
        </div>
      )}
      {editable && (
        <div>
          <Edit3 className="w-4 h-4 text-neutral-400" />
        </div>
      )}
    </div>
  </div>
);

export default function ButtonAddModal({
  isOpen,
  onClose,
  buttonData,
  onSave,
}: ButtonAddModalProps) {
  const { success, error } = useToast();
  const [buttonNo, setButtonNo] = React.useState<string>("1");
  const [name, setName] = React.useState("");
  const [buttonType, setButtonType] = React.useState<ButtonType>("client");
  const [commands, setCommands] = React.useState<ButtonCommand[]>([
    { id: 0, send: "", receive: "", duration: 0, sequence_order: 0 },
  ]);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);
  const [isButtonTypeDropdownOpen, setIsButtonTypeDropdownOpen] =
    React.useState(false);

  // buttonData가 변경될 때마다 formData 업데이트
  React.useEffect(() => {
    if (buttonData) {
      setButtonNo(buttonData.button_no.toString());
      setName(buttonData.name);
      setButtonType(buttonData.button_type);
      setCommands(buttonData.commands || []);
    } else {
      setButtonNo("1");
      setName("");
      setButtonType("client");
      setCommands([
        { id: 0, send: "", receive: "", duration: 0, sequence_order: 0 },
      ]);
    }
  }, [buttonData]);

  const handleAddCommand = () => {
    const newCommand: ButtonCommand = {
      id: Date.now(),
      send: "",
      receive: "",
      duration: 0,
      sequence_order: commands.length,
    };
    setCommands([...commands, newCommand]);
  };

  const handleRemoveCommand = (index: number) => {
    if (commands.length === 1) {
      error("최소 1개의 명령어가 필요합니다.");
      return;
    }
    const newCommands = commands.filter((_, i) => i !== index);
    setCommands(newCommands);
  };

  const handleCommandChange = (
    index: number,
    field: keyof ButtonCommand,
    value: string | number
  ) => {
    const newCommands = [...commands];
    newCommands[index] = { ...newCommands[index], [field]: value };
    setCommands(newCommands);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newCommands = [...commands];
    const draggedItem = newCommands[draggedIndex];
    newCommands.splice(draggedIndex, 1);
    newCommands.splice(index, 0, draggedItem);

    setCommands(newCommands);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleSave = async () => {
    // 필드 검증
    const buttonNoNum = parseInt(buttonNo);
    if (!buttonNo || isNaN(buttonNoNum) || buttonNoNum < 1) {
      error("버튼 번호는 1 이상의 숫자여야 합니다.");
      return;
    }

    if (!name.trim()) {
      error("버튼 이름을 입력해주세요.");
      return;
    }

    for (const cmd of commands) {
      if (!cmd.send.trim() || cmd.duration <= 0) {
        error("모든 명령어의 Send, Duration을 입력해주세요.");
        return;
      }
    }

    try {
      setIsSaving(true);

      const url = buttonData
        ? `/api/admin/buttons/${buttonData.id}`
        : "/api/admin/buttons";

      const method = buttonData ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          button_no: parseInt(buttonNo),
          name,
          button_type: buttonType,
          commands: commands.map((cmd, index) => ({
            send: cmd.send,
            receive: cmd.receive || "",
            duration: cmd.duration,
            sequence_order: index,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        error(errorData.message || "버튼 저장에 실패했습니다.");
        return;
      }

      const result = await response.json();

      if (result.success) {
        success(
          buttonData
            ? "버튼이 성공적으로 수정되었습니다."
            : "버튼이 성공적으로 등록되었습니다."
        );
        onSave?.();
        onClose();
      } else {
        error(result.message || "버튼 저장에 실패했습니다.");
      }
    } catch {
      error("서버 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!buttonData) return;

    if (!confirm("정말 이 버튼을 삭제하시겠습니까?")) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/admin/buttons/${buttonData.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (response.ok && result.success) {
        success("버튼이 성공적으로 삭제되었습니다.");
        onSave?.();
        onClose();
      } else {
        error(result.message || "버튼 삭제에 실패했습니다.");
      }
    } catch {
      error("서버 오류가 발생했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    setButtonNo("1");
    setName("");
    setButtonType("client");
    setCommands([
      { id: 0, send: "", receive: "", duration: 0, sequence_order: 0 },
    ]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[1032px] p-0 bg-zinc-100 border-0 rounded-2xl max-h-[90vh] max-md:max-w-[800px] max-md:w-full max-sm:max-w-[400px] overflow-y-auto">
        <div className="flex flex-col gap-16 items-start px-16 pt-14 pb-8 rounded-2xl bg-zinc-100 w-full max-md:px-10 max-md:pt-8 max-md:pb-6 max-sm:gap-10 max-sm:px-5 max-sm:pt-6 max-sm:pb-5">
          <div className="flex flex-col gap-8 items-start w-full">
            {/* Header */}
            <div className="flex justify-between items-center w-full">
              <div className="flex flex-col gap-1 items-start">
                <DialogTitle className="text-2xl font-bold leading-8 text-zinc-900 max-sm:text-xl">
                  {buttonData ? "버튼 정보 수정" : "버튼 등록"}
                </DialogTitle>
              </div>
              <Button
                onClick={handleClose}
                variant="ghost"
                size="icon"
                className="h-8 w-8 p-0 hover:bg-transparent"
              >
                <X className="h-8 w-8 text-gray-500" strokeWidth={2} />
              </Button>
            </div>

            {/* Form Fields */}
            <div className="flex flex-col gap-5 items-start w-full max-sm:gap-4">
              <FormField
                label="버튼 번호"
                value={buttonNo}
                editable
                width="w-full"
                onChange={(value) => setButtonNo(value)}
              />
              <FormField
                label="버튼 이름"
                value={name}
                editable
                width="w-full"
                onChange={(value) => setName(value)}
              />

              {/* Button Type */}
              <div className="flex items-center w-full h-11 max-sm:flex-col max-sm:gap-2 max-sm:items-start max-sm:h-auto">
                <div className="text-base leading-6 text-neutral-700 w-[120px] max-sm:w-full">
                  버튼 타입
                </div>
                <div className="w-full">
                  <div className="relative">
                    <button
                      onClick={() =>
                        setIsButtonTypeDropdownOpen(!isButtonTypeDropdownOpen)
                      }
                      className="flex gap-10 justify-between items-center p-3 w-full bg-white rounded-md border border-gray-200 border-solid text-xs font-bold text-sky-500"
                    >
                      <span className="self-stretch my-auto text-sky-500">
                        {buttonType === "client" ? "클라이언트" : "어드민"}
                      </span>
                      <Image
                        src="/arrow_down.svg"
                        alt="dropdown arrow"
                        width={10}
                        height={7}
                        className="flex-shrink-0"
                      />
                    </button>

                    {isButtonTypeDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                        <button
                          onClick={() => {
                            setButtonType("client");
                            setIsButtonTypeDropdownOpen(false);
                          }}
                          className="w-full p-3 text-left hover:bg-gray-50 text-sky-500 first:rounded-t-md last:rounded-b-md text-xs font-bold"
                        >
                          클라이언트
                        </button>
                        <button
                          onClick={() => {
                            setButtonType("admin");
                            setIsButtonTypeDropdownOpen(false);
                          }}
                          className="w-full p-3 text-left hover:bg-gray-50 text-sky-500 first:rounded-t-md last:rounded-b-md text-xs font-bold"
                        >
                          어드민
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Commands Section */}
              <div className="w-full">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-base leading-6 text-neutral-700 font-semibold">
                    명령어 목록
                  </div>
                  <Button
                    type="button"
                    onClick={handleAddCommand}
                    size="sm"
                    variant="outline"
                    className="flex gap-2 items-center"
                  >
                    <Plus className="w-4 h-4" />
                    명령어 추가
                  </Button>
                </div>

                <div className="space-y-3">
                  {commands.map((command, index) => (
                    <div
                      key={command.id}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`flex gap-3 items-start p-4 border rounded-lg bg-white cursor-move hover:bg-gray-50 transition-colors ${
                        draggedIndex === index ? "opacity-50" : ""
                      }`}
                    >
                      <div className="flex items-center pt-2">
                        <GripVertical className="w-5 h-5 text-gray-400" />
                      </div>

                      <div className="flex-1 grid grid-cols-3 gap-3">
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-neutral-700">
                            Send
                          </div>
                          <input
                            type="text"
                            value={command.send}
                            onChange={(e) =>
                              handleCommandChange(index, "send", e.target.value)
                            }
                            placeholder="예: (IDON)"
                            className="w-full p-2 border-b border-solid border-b-neutral-500 text-base leading-6 text-neutral-500 bg-transparent outline-none"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="text-sm font-medium text-neutral-700">
                            Receive{" "}
                            <span className="text-xs text-gray-400">
                              (선택)
                            </span>
                          </div>
                          <input
                            type="text"
                            value={command.receive}
                            onChange={(e) =>
                              handleCommandChange(
                                index,
                                "receive",
                                e.target.value
                              )
                            }
                            placeholder="예: (IDCN)"
                            className="w-full p-2 border-b border-solid border-b-neutral-500 text-base leading-6 text-neutral-500 bg-transparent outline-none"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="text-sm font-medium text-neutral-700">
                            Duration (초)
                          </div>
                          <input
                            type="number"
                            value={command.duration}
                            onChange={(e) =>
                              handleCommandChange(
                                index,
                                "duration",
                                parseInt(e.target.value) || 0
                              )
                            }
                            placeholder="1"
                            className="w-full p-2 border-b border-solid border-b-neutral-500 text-base leading-6 text-neutral-500 bg-transparent outline-none"
                            min="1"
                          />
                        </div>
                      </div>

                      <Button
                        type="button"
                        onClick={() => handleRemoveCommand(index)}
                        size="sm"
                        variant="ghost"
                        className="mt-6 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2.5 justify-center items-end w-full">
              {buttonData ? (
                <Button
                  onClick={handleDelete}
                  disabled={isSaving || isDeleting}
                  variant="outline"
                  className="flex gap-1 justify-center items-center px-2.5 py-1 bg-white border border-red-500 rounded-lg text-base font-bold leading-6 hover:text-red-500 text-red-500 hover:bg-red-50 h-[52px] w-[200px] max-sm:w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mx-2" />
                      삭제 중
                    </>
                  ) : (
                    <>삭제</>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleClose}
                  disabled={isSaving || isDeleting}
                  variant="outline"
                  className="flex gap-1 justify-center items-center px-2.5 py-1 bg-white border border-gray-300 rounded-lg text-base font-bold leading-6 text-gray-700 hover:bg-gray-50 h-[52px] w-[200px] max-sm:w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  취소
                </Button>
              )}
              <Button
                onClick={handleSave}
                disabled={isSaving || isDeleting}
                className="flex gap-1 justify-center items-center px-2.5 py-1 bg-sky-500 rounded-lg text-base font-bold leading-6 text-white hover:bg-sky-600 h-[52px] w-[200px] max-sm:w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mx-2" />
                    저장 중
                  </>
                ) : (
                  "저장"
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
