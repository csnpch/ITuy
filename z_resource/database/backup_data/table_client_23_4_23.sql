PGDMP                         {            db_ituy    15.2    15.1     "           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            #           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            $           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            %           1262    50312    db_ituy    DATABASE     �   CREATE DATABASE db_ituy WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
    DROP DATABASE db_ituy;
                postgres    false            �            1259    50380    client    TABLE       CREATE TABLE public.client (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying(80),
    nickname character varying(20),
    fullname character varying(120),
    branch character varying(8),
    role smallint,
    section smallint,
    description character varying(40),
    username character varying(40) NOT NULL,
    password text NOT NULL,
    salt text NOT NULL,
    created_at timestamp(0) without time zone DEFAULT now() NOT NULL,
    updated_at timestamp(0) without time zone DEFAULT now() NOT NULL
);
    DROP TABLE public.client;
       public         heap    postgres    false                      0    50380    client 
   TABLE DATA           �   COPY public.client (id, email, nickname, fullname, branch, role, section, description, username, password, salt, created_at, updated_at) FROM stdin;
    public          postgres    false    220   >       �           2606    50389    client user_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.client
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.client DROP CONSTRAINT user_pkey;
       public            postgres    false    220               Q  x���=�$U���S�je���c"N�	H�g[ X������"���f��{����-����v����c��3V瓉ƹ����B$���}g�@؉��&��?���ݯ��lou�����o�n8�����{� ���Z�6;pE�
	�[;+�=+>��S����eL>"s��"�O��#r���z�[;�O�7�w��o�.J�;���'Ø�a���p�����K]_��G�����f-�r���3� ��0�,��h�7�j��2!�FV8r
�X��$b!W�b�:��F�e��Lr�jz֣�9�J��I�h��KO��^_��G������{��%{��n��fٲ����SL@v���1��J���� ����K-oT��-��4������U�D7f���۞N_io�p��z������O�>��p��Ç���~��z������\��=��y�C���Fg�E��%$�gXJ��9K����-�w�Tz����4#�1.�n,i�u*�Fzp^��>*�9y]ş|N�v&�� G[�,=X��������VjP�`Q"��mz����F���7@#��P.�I}��V�ZG%�T����o���%_�6^��;*��[��>zC>��0
x!�S+뽇v������5��x���JU�����[F���˺Ik�����-���Y�Y�(GBżm�X�e�(mP�7~7����v٭�%.��P���(�'��]��n��Y�?Q��p�+�D��P;��W��r���- ��Ȳ�rs6/o���е�`�xs�%�%���Zܐ�	܉|��'�E�+h�90jW-�M'OA{�~�Y9�<�^��tN�s�&"L��EZ{�D�kAQ�0kF�=UAt�H$��Bn��zX��5x4Z��\c��#o�uݲ]Vo>U�RȨyν�Y[�B֎p��=<����/<��):� ��}���c����n�A���,B����YJ�^	3�>��1z�d�V���j�4����9��"����i1v�x�S�T�Jw�u�����ʎ}�rd:�t�fR��kQ���^ǅQa|������6�Gk׿'{��������!(���M���+#�	���*�+Yݰ]�{{�\��	w�     