import { useForm } from "react-hook-form";
import "./App.css";
import { Card } from "./types/Card";
import { useEffect } from "react";
import { useFormStore } from "./store/useFormStore";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";

export const App = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<Card>({
    mode: "onBlur",
    defaultValues: {
      pan: "",
      expire: "",
      cardholder: "",
      cvc: "",
    },
  });
  const { status, checkPaid, setStatus } = useFormStore();

  const pan = watch("pan");

  console.log(pan, pan.length);

  const onSubmit = async (data: Card) => {
    if (!data) return;

    setStatus("process");

    const formData = {
      jsonrpc: "2.0",
      id: String(Date.now()),
      method: "pay",
      params: {
        ...data,
        pan: data.pan.replace(/\s+/g, ""),
      },
    };

    try {
      const response = await fetch("http://localhost:2050/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (data.result.pid) {
        startStatusCheck(data.result.pid);
      }
    } catch (error) {
      console.log(error);
      setStatus("fail");
    }
  };

  const startStatusCheck = (pid: string) => {
    const interval = setInterval(async () => {
      const currentStatus = useFormStore.getState().status;
      if (currentStatus !== "process") {
        clearInterval(interval);
        return;
      }
      await checkPaid(pid);
    }, 1000);
  };

  useEffect(() => {
    if (pan) {
      const value = pan.replace(/\D/g, "");
      const formatted = value.replace(/(\d{4})(?=\d)/g, "$1 ");
      setValue("pan", formatted);
    }
  }, [pan, setValue]);

  const renderStatusMessage = () => {
    if (status === "ok")
      return (
        <div>
          <DoneIcon className="text-success" sx={{ fontSize: "47px" }} />
          <h2 className="text-title">Оплата прошла успешно</h2>
        </div>
      );

    if (status === "fail")
      return (
        <div>
          <CloseIcon className="text-error" sx={{ fontSize: "47px" }} />
          <h2 className="text-title">Произошла ошибка</h2>
        </div>
      );

    return null;
  };

  return (
    <>
      <div className="container">
        <div className="bg-white py-8 px-5 rounded-lg form">
          {renderStatusMessage() || (
            <div>
              <h2 className="text-title mb-4 text-left text-grey-1000">
                Оплата банковской картой
              </h2>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="my-5">
                  <label
                    htmlFor="pan"
                    className="text-left text-grey-800 block w-full text-left mb-1"
                  >
                    Номер карты
                  </label>
                  <input
                    type="text"
                    id="pan"
                    placeholder="0000 0000 0000 0000"
                    className={`w-full rounded-lg bg-white border text-black py-2 px-3 ${
                      errors.pan ? "border-error" : "border-grey-20"
                    }`}
                    maxLength={19}
                    minLength={13}
                    disabled={status === "process"}
                    {...register("pan", {
                      required: "Номер карты обязателен",
                      minLength: {
                        value: 13,
                        message:
                          "Вы неправильно указали номер карты. Пожалуйста, проверьте количество цифр введённого номера карты и их последовательность",
                      },
                      maxLength: {
                        value: 19,
                        message:
                          "Вы неправильно указали номер карты. Пожалуйста, проверьте количество цифр введённого номера карты и их последовательность",
                      },
                    })}
                  />
                  {errors.pan && (
                    <p className="text-error text-left">{errors.pan.message}</p>
                  )}
                </div>
                <div className="my-5 flex justify-between items-start gap-16">
                  <div>
                    <label
                      htmlFor="expire"
                      className="text-left text-grey-800 block w-full text-left mb-1"
                    >
                      Месяц / год
                    </label>
                    <input
                      type="text"
                      id="expire"
                      disabled={status === "process"}
                      {...register("expire", {
                        required: "Дата окончания действия обязательна",
                        pattern: {
                          value: /^(0[1-9]|1[0-2])\/(2[1-6])$/,
                          message:
                            "Дата должна быть в формате MM/YY (01-12 / 21-26)",
                        },
                      })}
                      placeholder="06/29"
                      className={`w-full rounded-lg bg-white border text-black py-2 px-3 ${
                        errors.expire ? "border-error" : "border-grey-20"
                      }`}
                    />
                    {errors.expire && (
                      <p className="text-error text-left">
                        {errors.expire.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="cvc"
                      className="text-left text-grey-800 block w-full text-left mb-1"
                    >
                      Код
                    </label>
                    <input
                      id="cvc"
                      placeholder="***"
                      type="password"
                      className={`w-full rounded-lg bg-white border text-black py-2 px-3 ${
                        errors.cvc ? "border-error" : "border-grey-20"
                      }`}
                      disabled={status === "process"}
                      {...register("cvc", {
                        required: "CVC обязателен",
                        pattern: {
                          value: /^\d{3}$/,
                          message: "CVC должен состоять из 3 цифр",
                        },
                      })}
                      maxLength={3}
                      inputMode="numeric"
                    />
                    {errors.cvc && (
                      <p className="text-error text-left">
                        {errors.cvc.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="my-5">
                  <label
                    htmlFor="cardholder"
                    className="text-left text-grey-800 block w-full text-left mb-1"
                  >
                    Владелец карты
                  </label>
                  <input
                    type="text"
                    id="cardholder"
                    placeholder="IVAN IVANOV"
                    className={`w-full rounded-lg bg-white border text-black py-2 px-3 ${
                      errors.cardholder ? "border-error" : "border-grey-20"
                    }`}
                    disabled={status === "process"}
                    {...register("cardholder", {
                      required: "Имя владельца карты обязательно",
                      pattern: {
                        value: /^[A-Za-z]+ [A-Za-z]+$/,
                        message: "Введите имя и фамилию без цифр",
                      },
                    })}
                  />
                  {errors.cardholder && (
                    <p className="text-error text-left">
                      {errors.cardholder.message}
                    </p>
                  )}
                </div>
                <div className="w-full inline-flex justify-end mt-5">
                  <button
                    className={`text-button rounded-lg py-3 px-5 w-[123px] flex items-center justify-center ${
                      isDirty
                        ? "bg-primary text-white"
                        : "bg-grey-100 text-grey-400"
                    }`}
                    disabled={status === "process" || !isDirty}
                    type="submit"
                  >
                    {status === "process" ? (
                      <div className="spinner"></div>
                    ) : (
                      "Оплатить"
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
