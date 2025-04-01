"use client";

import CalendarIcon from "@/assets/EventCreate/CalendarIcon.svg";
import EditIcon from "@/assets/EventCreate/EditIcon.svg";
import LocationIcon from "@/assets/EventCreate/LocationIcon.svg";
import LockIcon from "@/assets/EventCreate/LockIcon.svg";
import PlusIcon from "@/assets/EventCreate/PlusIcon.svg";
import UploadImgIcon from "@/assets/EventCreate/UploadImgIcon.svg";
import UsersIcon from "@/assets/EventCreate/UsersIcon.svg";
import WriteIcon from "@/assets/EventCreate/WriteIcon.svg";
import ImgComponent from "@/components/Image";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import Wrapper from "@/components/Wrapper";
import { selectUserInfo } from "@/lib/features/wepin/loginSlice";
import fetchData from "@/lib/fetchData";
import { useAppSelector } from "@/lib/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import dayjs from "dayjs";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export default function CreateEvent() {
  const userInfo = useAppSelector(selectUserInfo);

  const [previewImg, setPreviewImg] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isGuestsEditing, setIsGuestsEditing] = useState(false);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);

  const formSchema = z.object({
    image: z
      .any()
      .refine((file) => file instanceof FileList && file.length > 0, {
        message: "Image is required",
      }),
    title: z.string().min(1, { message: "Title is required" }),
    date: z.date({ required_error: "Date is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    location: z.string().min(1, { message: "Location is required" }),
    private: z.boolean(),
    price: z.string().min(1, { message: "Price is required" }),
    target: z.string().min(1, { message: "Price target is required" }),
    guests: z.string().min(1, { message: "Guest is required" }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: undefined,
      title: "",
      date: undefined,
      description: "",
      location: "",
      private: false,
      price: "",
      target: "",
      guests: "",
    },
  });

  const onSubmit = async (data: {
    image: FileList;
    title: string;
    date: Date;
    description: string;
    location: string;
    private: boolean;
    price: string;
    target: string;
    guests: string;
  }) => {
    try {
      if (!userInfo) {
        toast.error("Use this feature after login.");
        return;
      } else if (userInfo.auth !== "ADMIN") {
        toast.error("Only admin feature.");
        return;
      }

      const file = data.image[0];
      const maxFileSize = 5 * 1024 * 1024;
      const formData = new FormData();

      if (file.size > maxFileSize) {
        toast.error("File size exceeds the limit of 5MB.");
        return;
      }

      formData.append("file", file);

      const response = await fetchData(
        "/upload-img-in-bucket",
        "POST",
        formData,
        true
      );

      await fetchData("/event/create", "POST", {
        userId: userInfo.id,
        title: data.title,
        description: data.description,
        image_url: response.url,
        is_private: data.private,
        max_participants: Number(data.guests),
        receive_address: userInfo.walletId,
        start_at: dayjs(data.date).format("YYYY-MM-DD HH:mm:ss"),
        location: data.location,
        price: Number(data.price),
        target: data.target,
      });

      toast.success("Success!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Wrapper>
      <div className="mx-20 mt-20">
        <div className="my-10 text-[2rem]">Create Event</div>
        <Form {...form}>
          <form
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col"
          >
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem className="my-20">
                  <Label htmlFor="profile">
                    {previewImg ? (
                      <ImgComponent
                        imgSrc={previewImg}
                        className="aspect-square w-full! rounded-[2rem]"
                      />
                    ) : (
                      <div
                        style={{
                          background:
                            "linear-gradient(to right bottom, #E2E8F0 0%, #D4E5FF 46%, #C5C1FF 96%)",
                        }}
                        className="flex flex-col items-center justify-center aspect-square w-full rounded-[2rem] text-[1.2rem] text-white"
                      >
                        <ImgComponent
                          imgSrc={UploadImgIcon}
                          className="mb-10"
                        />
                        Upload Image
                      </div>
                    )}
                  </Label>
                  <FormControl>
                    <Input
                      id="profile"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        field.onChange(e.target.files);
                        if (e.target.files && e.target.files[0]) {
                          setPreviewImg(URL.createObjectURL(e.target.files[0]));
                        }
                      }}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Event title"
                      className="text-[1.6rem]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="mt-20">
                  <FormControl>
                    <Popover open={isOpen} onOpenChange={setIsOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          className={clsx(
                            "bg-light-blue w-full min-h-42 justify-start px-10 py-11 text-[1.2rem]",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <ImgComponent
                            imgSrc={CalendarIcon}
                            className="mr-8"
                          />
                          {field.value ? (
                            <span className="text-blue">
                              {dayjs(field.value).format("MM/DD/YYYY hh:mm A")}
                            </span>
                          ) : (
                            <span>MM/DD/YYYY hh:mm A</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-5">
                        <div className="flex">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(selectedDate) => {
                              if (selectedDate) {
                                const newDate = new Date(selectedDate);
                                if (field.value) {
                                  newDate.setHours(field.value.getHours());
                                  newDate.setMinutes(field.value.getMinutes());
                                }
                                field.onChange(newDate);
                              }
                            }}
                            initialFocus
                          />
                          <div className="flex flex-col flex-row h-[300px] ml-10 divide-y divide-y-0 divide-x text-[1.2rem]">
                            <ScrollArea className="w-64 w-auto">
                              <div className="flex flex-col gap-5 px-10 py-2">
                                {hours.map((hour) => (
                                  <Button
                                    key={hour}
                                    size="icon"
                                    variant={
                                      field.value &&
                                      field.value.getHours() % 12 === hour % 12
                                        ? "default"
                                        : "ghost"
                                    }
                                    className="w-full shrink-0 aspect-square"
                                    onClick={() => {
                                      const newDate = new Date(
                                        field.value || new Date()
                                      );
                                      newDate.setHours(
                                        (hour % 12) +
                                          (newDate.getHours() >= 12 ? 12 : 0)
                                      );
                                      field.onChange(newDate);
                                    }}
                                  >
                                    {hour}
                                  </Button>
                                ))}
                              </div>
                              <ScrollBar
                                orientation="horizontal"
                                className="hidden"
                              />
                            </ScrollArea>
                            <ScrollArea className="w-64 w-auto">
                              <div className="flex flex-col gap-5 px-10 py-2">
                                {Array.from({ length: 60 }, (_, i) => i).map(
                                  (minute) => (
                                    <Button
                                      key={minute}
                                      size="icon"
                                      variant={
                                        field.value &&
                                        field.value.getMinutes() === minute
                                          ? "default"
                                          : "ghost"
                                      }
                                      className="w-full shrink-0 aspect-square"
                                      onClick={() => {
                                        const newDate = new Date(
                                          field.value || new Date()
                                        );
                                        newDate.setMinutes(minute);
                                        field.onChange(newDate);
                                      }}
                                    >
                                      {minute}
                                    </Button>
                                  )
                                )}
                              </div>
                              <ScrollBar
                                orientation="horizontal"
                                className="hidden"
                              />
                            </ScrollArea>
                            <ScrollArea className="">
                              <div className="flex flex-col gap-5 px-10 py-2">
                                {["AM", "PM"].map((ampm) => (
                                  <Button
                                    key={ampm}
                                    size="icon"
                                    variant={
                                      field.value &&
                                      ((ampm === "AM" &&
                                        field.value.getHours() < 12) ||
                                        (ampm === "PM" &&
                                          field.value.getHours() >= 12))
                                        ? "default"
                                        : "ghost"
                                    }
                                    className="w-full shrink-0 aspect-square"
                                    onClick={() => {
                                      const newDate = new Date(
                                        field.value || new Date()
                                      );
                                      const currentHours = newDate.getHours();
                                      newDate.setHours(
                                        ampm === "PM"
                                          ? currentHours < 12
                                            ? currentHours + 12
                                            : currentHours
                                          : currentHours >= 12
                                          ? currentHours - 12
                                          : currentHours
                                      );
                                      field.onChange(newDate);
                                    }}
                                  >
                                    {ampm}
                                  </Button>
                                ))}
                              </div>
                            </ScrollArea>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="mt-20">
                  <FormControl>
                    <div className="flex items-center bg-light-blue w-full min-h-42 justify-start px-10 py-11 rounded-xl text-[1.2rem]">
                      <ImgComponent imgSrc={LocationIcon} className="mr-8" />
                      <Input
                        className="bg-transparent p-0 border-none shadow-none text-[1.2rem] font-normal rounded-none"
                        placeholder="Location"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="mt-12">
                  <Label className="mb-10 text-gray1 text-[1.2rem]">
                    <ImgComponent imgSrc={EditIcon} className="ml-10 mr-8" />
                    Description
                  </Label>
                  <FormControl>
                    <Textarea
                      placeholder="Type your description"
                      {...field}
                      className="h-80 text-[1.2rem]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="private"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between bg-light-blue w-full min-h-42 mt-12 px-10 py-11 rounded-[0.8rem]">
                  <Label className="text-[1.2rem] text-gray1">
                    <ImgComponent imgSrc={LockIcon} className="mr-8" />
                    Private
                  </Label>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col mt-12">
              <Label className="mb-10 text-gray1 text-[1.2rem]">
                <ImgComponent imgSrc={EditIcon} className="ml-10 mr-8" />
                Price
              </Label>
              <div className="flex items-center gap-5">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          placeholder="1,000,000"
                          className="text-[1.4rem]"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="target"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-110">
                            <SelectValue
                              placeholder="Target"
                              className="text-[1.4rem]"
                            />
                          </SelectTrigger>
                          <SelectContent className="text-[1.4rem]">
                            <SelectItem value="eth">USD</SelectItem>
                            <SelectItem value="point">Point</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="guests"
              render={({ field }) => {
                return (
                  <FormItem className="flex items-center justify-between bg-light-blue w-full min-h-42 mt-12 px-10 py-11 rounded-[0.8rem] text-gray1">
                    <Label className="text-[1.2rem]">
                      <ImgComponent imgSrc={UsersIcon} className="mr-8" />
                      Number of Guests
                    </Label>
                    <div className="flex items-center gap-5 mr-10 text-[1.2rem]">
                      {isGuestsEditing ? (
                        <Input
                          type="number"
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                          onBlur={() => setIsGuestsEditing(false)}
                          className="w-50 p-1 text-center"
                        />
                      ) : (
                        <div onClick={() => setIsGuestsEditing(true)}>
                          {field.value || "0"}
                        </div>
                      )}
                      <div onClick={() => setIsGuestsEditing((prev) => !prev)}>
                        <ImgComponent imgSrc={WriteIcon} />
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <Button
              type="submit"
              className="bg-brand mt-40 py-10 text-[1.8rem] text-white font-light"
            >
              <ImgComponent imgSrc={PlusIcon} className="mr-8" />
              Create event
            </Button>
          </form>
        </Form>
      </div>
    </Wrapper>
  );
}
