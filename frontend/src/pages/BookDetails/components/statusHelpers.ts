export const statusColors = {
  wantToRead:
    "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
  ongoing:
    "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600",
  completed:
    "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700",
};

export const statusLabels = {
  wantToRead: "Want to Read",
  ongoing: "Ongoing",
  completed: "Completed",
};

export const statusOptions = [
  { value: "wantToRead", label: "Want to Read" },
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed" },
  { value: "remove", label: "Remove from Shelf" },
];

export const getStatusColor = (status: string | null): string => {
  if (!status) return statusColors.wantToRead;
  return (
    statusColors[status as keyof typeof statusColors] || statusColors.wantToRead
  );
};
