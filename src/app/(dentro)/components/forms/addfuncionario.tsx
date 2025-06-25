"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import Image from "next/image";

const schema = z.object({
  username: z
    .string()
    .min(3, { message: "Obrigatorio!" })
    .max(20, { message: "Obrigatorio!" }),
  email: z.string().email({ message: "Invalido email!" }),
  password: z
    .string()
    .min(8, { message: "" }),
  firstName: z.string().min(1, { message: "Obrigatorio!" }),
  lastName: z.string().min(1, { message: "Obrigatorio!" }),
  phone: z.string().min(1, { message: "Obrigatorio!" }),
  address: z.string().min(1, { message: "" }),
  bloodType: z.string().min(1, { message: "Obrigatorio!" }),
  birthday: z.date({ message: "Obrigatorio!" }),
  sex: z.enum(["male", "female"], { message: "Obrigatorio!" }),
  img: z.instanceof(File, { message: "Obrigatorio!" }),
});

type Inputs = z.infer<typeof schema>;

const StudentForm = ({
  type,
  data,
}: {
  type: "Adicionar" | "update";
  data?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

  return (
    <form className="flex flex-col  " onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold my-3">Adicionar Funcionário</h1>
      <span className="text-xs text-gray-400 font-medium">
       Informações de Autenticação
      </span>
      <div className="flex justify-between flex-wrap gap-1">
        <InputField
          label="Nome de Usuário"
          name="username"
          defaultValue={data?.username}
          register={register}
          error={errors?.username}
        />
        <InputField
          label="Email"
          name="email"
          defaultValue={data?.email}
          register={register}
          error={errors?.email}
        />
        <InputField
          label="Palavra-Passe"
          name="password"
          type="password"
          defaultValue={data?.password}
          register={register}
          error={errors?.password}
        />
      </div>
      <span className="text-xs   text-gray-400 font-medium">
       Informações Pessoais
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Primeiro Nome"
          name="firstName"
          defaultValue={data?.firstName}
          register={register}
          error={errors.firstName}
        />
        <InputField
          label="Ultimo Nome"
          name="lastName"
          defaultValue={data?.lastName}
          register={register}
          error={errors.lastName}
        />
        <InputField
          label="Telefone"
          name="phone"
          defaultValue={data?.phone}
          register={register}
          error={errors.phone}
        />
        <InputField
          label="Endereço Residencial"
          name="address"
          defaultValue={data?.address}
          register={register}
          error={errors.address}
        />
        <InputField
          label="Data de Inicio"
          name="bloodType"
          defaultValue={data?.bloodType}
          register={register}
          error={errors.bloodType}
          type="date"
        />
        <InputField
          label="Data de Nascimento"
          name="birthday"
          defaultValue={data?.birthday}
          register={register}
          error={errors.birthday}
          type="date"
        />  <div className="flex flex-col gap-6   items-center justify-center">
        <label
          className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
          htmlFor="img"
        >
          <Image src="/upload.png" alt="" width={28} height={28} />
          <span>Carregar a foto</span>
        </label>
        <input type="file" id="img" {...register("img")} className="hidden" />
        {errors.img?.message && (
          <p className="text-xs text-red-400">
            {errors.img.message.toString()}
          </p>
        )}
      </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Genero</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("sex")}
            defaultValue={data?.sex}
          >
            <option value="male">Masculino</option>
            <option value="female">Femenino</option>
          </select>
          {errors.sex?.message && (
            <p className="text-xs text-red-400">
              {errors.sex.message.toString()}
            </p>
          )}
        </div>
      
      </div> <span className="text-xs text-gray-400 font-medium">
       Informações Profissionais
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Departamento"
          name="firstName"
          defaultValue={data?.firstName}
          register={register}
          error={errors.firstName}
        />
        <InputField
          label="Função"
          name="lastName"
          defaultValue={data?.lastName}
          register={register}
          error={errors.lastName}
        />
        <InputField
          label="Nível Academico"
          name="phone"
          defaultValue={data?.phone}
          register={register}
          error={errors.phone}
        />
        <InputField
          label="Endereço Residencial"
          name="address"
          defaultValue={data?.address}
          register={register}
          error={errors.address}
        />
        <InputField
          label="Habilidades Profissionais"
          name="bloodType"
          defaultValue={data?.bloodType}
          register={register}
          error={errors.bloodType}
          
        />
        <InputField
          label="Tipo de Contrato"
          name="birthday"
          defaultValue={data?.birthday}
          register={register}
          error={errors.birthday}
          type=""
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Período</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("sex")}
            defaultValue={data?.sex}
          >
            <option value="male">Manhã</option>
            <option value="female">Tarde</option>
            <option value="female">Noite</option>
            <option value="female">Integral</option>
          </select>
          {errors.sex?.message && (
            <p className="text-xs text-red-400">
              {errors.sex.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4 justify-center">
          <label
            className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
            htmlFor="img"
          >
            <Image src="/upload.png" alt="" width={28} height={28} />
            <span>CV</span>
          </label>
          <input type="file" id="img" {...register("img")} className="hidden" />
          {errors.img?.message && (
            <p className="text-xs text-red-400">
              {errors.img.message.toString()}
            </p>
          )}
        </div>
      </div>
      <button className="bg-blue-400 text-white p-2 rounded-md">
        Adicionar
      </button>
    </form>
  );
};

export default StudentForm;
