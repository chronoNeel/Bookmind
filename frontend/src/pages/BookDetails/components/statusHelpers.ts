import { StatusValue } from "@models/StatusModal";

export const statusColors: Record<
  Exclude<StatusValue, "remove" | null>,
  string
> = {
  wantToRead:
    "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
  ongoing:
    "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600",
  completed:
    "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700",
};

export const statusLabels: Record<
  Exclude<StatusValue, "remove" | null>,
  string
> = {
  wantToRead: "Want to Read",
  ongoing: "Ongoing",
  completed: "Completed",
};

export const statusOptions: Array<{
  value: Exclude<StatusValue, null>;
  label: string;
}> = [
  { value: "wantToRead", label: "Want to Read" },
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed" },
  { value: "remove", label: "Remove from Shelf" },
];

export const getStatusColor = (status: StatusValue): string => {
  if (!status || status === "remove") {
    return "bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600";
  }

  return statusColors[status];
};

export const getStatusLabel = (status: StatusValue): string => {
  if (!status || status === "remove") return "Add to Shelf";
  return statusLabels[status];
};
