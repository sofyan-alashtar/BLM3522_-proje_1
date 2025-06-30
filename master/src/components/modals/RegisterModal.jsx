import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Modal from './Modal';
import Heading from '../Heading';
import Input from '../inputs/Input';
import useRegisterModal from '../../hooks/useRegisterModal';
import useLoginModal from '../../hooks/UseLoginModal';
import { registerUser } from '../../utils/auth'; 

function RegisterModal() {
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      await registerUser(data);

      registerModal.onClose();
    } catch (error) {
      toast.error(error.message); 
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggle = useCallback(() => {
    registerModal.onClose();
    loginModal.onOpen();
  }, [loginModal, registerModal]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title={'Gazibnb\'ye Hoş Geldiniz'} subtitle={'Hesap oluşturun'} />
      <Input
        id="email"
        label="E-posta"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="username"
        label="Ad"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="password"
        type="password"
        label="Şifre"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      <div className="text-neutral-500 text-center mt-4 font-light">
        <div className="justify-center flex flex-row items-center gap-2">
          <div>Zaten bir hesabınız var mı?</div>
          <div
            onClick={toggle}
            className="text-neutral-800 cursor-pointer hover:underline"
          >
            Giriş yap
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={registerModal.isOpen}
      title={'Kayıt Ol'}
      actionLabel={'Devam et'}
      onClose={registerModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
}

export default RegisterModal;
