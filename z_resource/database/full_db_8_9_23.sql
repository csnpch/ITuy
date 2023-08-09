PGDMP         %    	    	        {            db_ituy    15.2    15.1 4    x           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            y           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            z           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            {           1262    50470    db_ituy    DATABASE     �   CREATE DATABASE db_ituy WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
    DROP DATABASE db_ituy;
                postgres    false                        3079    50471 	   uuid-ossp 	   EXTENSION     ?   CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;
    DROP EXTENSION "uuid-ossp";
                   false            |           0    0    EXTENSION "uuid-ossp"    COMMENT     W   COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';
                        false    2            �            1259    50506    bill    TABLE     �  CREATE TABLE public.bill (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    target character varying(80),
    title character varying(120) NOT NULL,
    description text,
    amount numeric(8,2) NOT NULL,
    deadline character varying(20) NOT NULL,
    status smallint,
    created_at timestamp(0) without time zone DEFAULT now() NOT NULL,
    updated_at timestamp(0) without time zone DEFAULT now() NOT NULL,
    client_id uuid NOT NULL
);
    DROP TABLE public.bill;
       public         heap    postgres    false    2            }           0    0    COLUMN bill.target    COMMENT     F   COMMENT ON COLUMN public.bill.target IS 'should array varchar(40)[]';
          public          postgres    false    217            �            1259    50482 	   bill_dict    TABLE     J  CREATE TABLE public.bill_dict (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    status smallint NOT NULL,
    status_name character varying(40) NOT NULL,
    description text,
    created_at timestamp(0) without time zone DEFAULT now() NOT NULL,
    updated_at timestamp(0) without time zone DEFAULT now() NOT NULL
);
    DROP TABLE public.bill_dict;
       public         heap    postgres    false    2            �            1259    50539    client    TABLE       CREATE TABLE public.client (
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
       public         heap    postgres    false    2            �            1259    50571    payment    TABLE     g  CREATE TABLE public.payment (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    client_id uuid NOT NULL,
    bill_id uuid,
    img_evidence text,
    relation_key character varying(80),
    status smallint,
    created_at timestamp(0) without time zone DEFAULT now() NOT NULL,
    updated_at timestamp(0) without time zone DEFAULT now() NOT NULL
);
    DROP TABLE public.payment;
       public         heap    postgres    false    2            �            1259    50591    payment_dict    TABLE     M  CREATE TABLE public.payment_dict (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    status smallint NOT NULL,
    status_name character varying(40) NOT NULL,
    description text,
    created_at timestamp(0) without time zone DEFAULT now() NOT NULL,
    updated_at timestamp(0) without time zone DEFAULT now() NOT NULL
);
     DROP TABLE public.payment_dict;
       public         heap    postgres    false    2            �            1259    50642    payment_method    TABLE     �  CREATE TABLE public.payment_method (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    client_id uuid NOT NULL,
    target character varying(14),
    method_identity character varying(200) NOT NULL,
    reserve_identity character varying(200),
    promptpay character varying(20) NOT NULL,
    status smallint,
    created_at timestamp(0) without time zone DEFAULT now() NOT NULL,
    updated_at timestamp(0) without time zone DEFAULT now() NOT NULL
);
 "   DROP TABLE public.payment_method;
       public         heap    postgres    false    2            �            1259    50549 	   role_dict    TABLE     F  CREATE TABLE public.role_dict (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    role smallint NOT NULL,
    role_name character varying(20) NOT NULL,
    description text,
    created_at timestamp(0) without time zone DEFAULT now() NOT NULL,
    updated_at timestamp(0) without time zone DEFAULT now() NOT NULL
);
    DROP TABLE public.role_dict;
       public         heap    postgres    false    2            �            1259    50494    section_dict    TABLE     F  CREATE TABLE public.section_dict (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    sec smallint NOT NULL,
    sec_name character varying(8) NOT NULL,
    description text,
    created_at timestamp(0) without time zone DEFAULT now() NOT NULL,
    updated_at timestamp(0) without time zone DEFAULT now() NOT NULL
);
     DROP TABLE public.section_dict;
       public         heap    postgres    false    2            �            1259    50561    transaction    TABLE     �  CREATE TABLE public.transaction (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    client_id uuid NOT NULL,
    title character varying(120) NOT NULL,
    description text,
    amount numeric(8,2) NOT NULL,
    vote_id uuid,
    status smallint,
    created_at timestamp(0) without time zone DEFAULT now() NOT NULL,
    updated_at timestamp(0) without time zone DEFAULT now() NOT NULL,
    link_evidence text
);
    DROP TABLE public.transaction;
       public         heap    postgres    false    2            �            1259    50527    transaction_dict    TABLE     Q  CREATE TABLE public.transaction_dict (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    status smallint NOT NULL,
    status_name character varying(40) NOT NULL,
    description text,
    created_at timestamp(0) without time zone DEFAULT now() NOT NULL,
    updated_at timestamp(0) without time zone DEFAULT now() NOT NULL
);
 $   DROP TABLE public.transaction_dict;
       public         heap    postgres    false    2            �            1259    50581    vote    TABLE     k  CREATE TABLE public.vote (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    agree character varying(40)[],
    disagree character varying(40)[],
    deadline character varying(20) NOT NULL,
    status boolean,
    created_at timestamp(0) without time zone DEFAULT now() NOT NULL,
    updated_at timestamp(0) without time zone DEFAULT now() NOT NULL
);
    DROP TABLE public.vote;
       public         heap    postgres    false    2            ~           0    0    COLUMN vote.agree    COMMENT     E   COMMENT ON COLUMN public.vote.agree IS 'should array varchar(40)[]';
          public          postgres    false    223                       0    0    COLUMN vote.disagree    COMMENT     H   COMMENT ON COLUMN public.vote.disagree IS 'should array varchar(40)[]';
          public          postgres    false    223            m          0    50506    bill 
   TABLE DATA           {   COPY public.bill (id, target, title, description, amount, deadline, status, created_at, updated_at, client_id) FROM stdin;
    public          postgres    false    217   �F       k          0    50482 	   bill_dict 
   TABLE DATA           a   COPY public.bill_dict (id, status, status_name, description, created_at, updated_at) FROM stdin;
    public          postgres    false    215   �L       o          0    50539    client 
   TABLE DATA           �   COPY public.client (id, email, nickname, fullname, branch, role, section, description, username, password, salt, created_at, updated_at) FROM stdin;
    public          postgres    false    219   �L       r          0    50571    payment 
   TABLE DATA           u   COPY public.payment (id, client_id, bill_id, img_evidence, relation_key, status, created_at, updated_at) FROM stdin;
    public          postgres    false    222   'R       t          0    50591    payment_dict 
   TABLE DATA           d   COPY public.payment_dict (id, status, status_name, description, created_at, updated_at) FROM stdin;
    public          postgres    false    224   +Z       u          0    50642    payment_method 
   TABLE DATA           �   COPY public.payment_method (id, client_id, target, method_identity, reserve_identity, promptpay, status, created_at, updated_at) FROM stdin;
    public          postgres    false    225   HZ       p          0    50549 	   role_dict 
   TABLE DATA           ]   COPY public.role_dict (id, role, role_name, description, created_at, updated_at) FROM stdin;
    public          postgres    false    220   �]       l          0    50494    section_dict 
   TABLE DATA           ^   COPY public.section_dict (id, sec, sec_name, description, created_at, updated_at) FROM stdin;
    public          postgres    false    216   �]       q          0    50561    transaction 
   TABLE DATA           �   COPY public.transaction (id, client_id, title, description, amount, vote_id, status, created_at, updated_at, link_evidence) FROM stdin;
    public          postgres    false    221   h^       n          0    50527    transaction_dict 
   TABLE DATA           h   COPY public.transaction_dict (id, status, status_name, description, created_at, updated_at) FROM stdin;
    public          postgres    false    218   �d       s          0    50581    vote 
   TABLE DATA           ]   COPY public.vote (id, agree, disagree, deadline, status, created_at, updated_at) FROM stdin;
    public          postgres    false    223   �d       �           2606    50491    bill_dict bill_dict_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.bill_dict
    ADD CONSTRAINT bill_dict_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.bill_dict DROP CONSTRAINT bill_dict_pkey;
       public            postgres    false    215            �           2606    50493 !   bill_dict bill_dict_status_unique 
   CONSTRAINT     ^   ALTER TABLE ONLY public.bill_dict
    ADD CONSTRAINT bill_dict_status_unique UNIQUE (status);
 K   ALTER TABLE ONLY public.bill_dict DROP CONSTRAINT bill_dict_status_unique;
       public            postgres    false    215            �           2606    50515    bill bill_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.bill
    ADD CONSTRAINT bill_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.bill DROP CONSTRAINT bill_pkey;
       public            postgres    false    217            �           2606    50548    client client_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.client
    ADD CONSTRAINT client_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.client DROP CONSTRAINT client_pkey;
       public            postgres    false    219            �           2606    50600    payment_dict payment_dict_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.payment_dict
    ADD CONSTRAINT payment_dict_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.payment_dict DROP CONSTRAINT payment_dict_pkey;
       public            postgres    false    224            �           2606    50602 '   payment_dict payment_dict_status_unique 
   CONSTRAINT     d   ALTER TABLE ONLY public.payment_dict
    ADD CONSTRAINT payment_dict_status_unique UNIQUE (status);
 Q   ALTER TABLE ONLY public.payment_dict DROP CONSTRAINT payment_dict_status_unique;
       public            postgres    false    224            �           2606    50649 "   payment_method payment_method_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public.payment_method
    ADD CONSTRAINT payment_method_pkey PRIMARY KEY (id);
 L   ALTER TABLE ONLY public.payment_method DROP CONSTRAINT payment_method_pkey;
       public            postgres    false    225            �           2606    50580    payment payment_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.payment DROP CONSTRAINT payment_pkey;
       public            postgres    false    222            �           2606    50558    role_dict role_dict_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.role_dict
    ADD CONSTRAINT role_dict_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.role_dict DROP CONSTRAINT role_dict_pkey;
       public            postgres    false    220            �           2606    50560    role_dict role_dict_role_unique 
   CONSTRAINT     Z   ALTER TABLE ONLY public.role_dict
    ADD CONSTRAINT role_dict_role_unique UNIQUE (role);
 I   ALTER TABLE ONLY public.role_dict DROP CONSTRAINT role_dict_role_unique;
       public            postgres    false    220            �           2606    50503    section_dict section_dict_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.section_dict
    ADD CONSTRAINT section_dict_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.section_dict DROP CONSTRAINT section_dict_pkey;
       public            postgres    false    216            �           2606    50505 $   section_dict section_dict_sec_unique 
   CONSTRAINT     ^   ALTER TABLE ONLY public.section_dict
    ADD CONSTRAINT section_dict_sec_unique UNIQUE (sec);
 N   ALTER TABLE ONLY public.section_dict DROP CONSTRAINT section_dict_sec_unique;
       public            postgres    false    216            �           2606    50536 &   transaction_dict transaction_dict_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public.transaction_dict
    ADD CONSTRAINT transaction_dict_pkey PRIMARY KEY (id);
 P   ALTER TABLE ONLY public.transaction_dict DROP CONSTRAINT transaction_dict_pkey;
       public            postgres    false    218            �           2606    50538 /   transaction_dict transaction_dict_status_unique 
   CONSTRAINT     l   ALTER TABLE ONLY public.transaction_dict
    ADD CONSTRAINT transaction_dict_status_unique UNIQUE (status);
 Y   ALTER TABLE ONLY public.transaction_dict DROP CONSTRAINT transaction_dict_status_unique;
       public            postgres    false    218            �           2606    50570    transaction transaction_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT transaction_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.transaction DROP CONSTRAINT transaction_pkey;
       public            postgres    false    221            �           2606    50590    vote vote_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.vote
    ADD CONSTRAINT vote_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.vote DROP CONSTRAINT vote_pkey;
       public            postgres    false    223            �           2606    50603    payment payment_bill_id_foreign    FK CONSTRAINT     }   ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_bill_id_foreign FOREIGN KEY (bill_id) REFERENCES public.bill(id);
 I   ALTER TABLE ONLY public.payment DROP CONSTRAINT payment_bill_id_foreign;
       public          postgres    false    217    3265    222            �           2606    50623 !   payment payment_client_id_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_client_id_foreign FOREIGN KEY (client_id) REFERENCES public.client(id);
 K   ALTER TABLE ONLY public.payment DROP CONSTRAINT payment_client_id_foreign;
       public          postgres    false    219    3271    222            �           2606    50650 /   payment_method payment_method_client_id_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public.payment_method
    ADD CONSTRAINT payment_method_client_id_foreign FOREIGN KEY (client_id) REFERENCES public.client(id);
 Y   ALTER TABLE ONLY public.payment_method DROP CONSTRAINT payment_method_client_id_foreign;
       public          postgres    false    3271    225    219            �           2606    50608 )   transaction transaction_client_id_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT transaction_client_id_foreign FOREIGN KEY (client_id) REFERENCES public.client(id);
 S   ALTER TABLE ONLY public.transaction DROP CONSTRAINT transaction_client_id_foreign;
       public          postgres    false    221    3271    219            �           2606    50618 '   transaction transaction_vote_id_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT transaction_vote_id_foreign FOREIGN KEY (vote_id) REFERENCES public.vote(id);
 Q   ALTER TABLE ONLY public.transaction DROP CONSTRAINT transaction_vote_id_foreign;
       public          postgres    false    3281    223    221            m   (  x��X�nE]����
$*���W_�M=? g�")�4�dA�BJ	� ��f>�[=��g<v
0	Yt���G�q��v�k@T�WT��V�kT	B��oC^|y�ҽG�OV�OV˟W�OW�7���r����߯��>=^-X-OW�W���寳���DlO>_����^ *mj��!R��i�f�;C?AX�IW�[��+���X�����+�#ʞ�(RV쳗�
(�	��!s�=&��f�~�cx5����Q�{����^�ο[\y�f��z�|2(���~�mz���[�ʜ�׳����;���&;gn�8i?{� AG)��_��PŚ�
6IKK>r��}�N�@Qo��O�����Q�~�s�~�|m�@��d�D�&rc���9%��jS�8J")L[84Cܶ��=s�ZO��,��ڷh�����
�ds�~��,�5����_�RS����0�Θ}�w>jw�fBC�3�z���n�V �H�%�;$Pk��gk�D�W��'s���J-֓��~�����������B,�U�&�1K�	��3P���6�*���(o�Z�ƿ����C>�*�cɡ�,��gf���I�lF�:8�,8E�Rm\�ox��͌q��|�v˺o6Py7w㙜���غ�錥9`�����6��C����k�	�Lx�-��0����Z��r�b��')�@I�]��	gpj7�~Vv�i߇�XM]�`kU�2Qف�f�j�S�R�y������_l�v'���*�x�a���].��@�X�^<�ͺ1�TșE(D.M,31�y�K��}1O������}|}i$c��]g����˦�����0�AM�gA�Ԥ�Z,6��w���o1&�4�O� d3rk�Y��bSY�PV��s��I�n�D�{FA�6���+�C��I�O�i�oZD����J����Ft�RN ��I�j�Q�_�t�6�>?�=�͐��]�=� 0EK�p����n����R�˘�Ѫh�S&��;j�.�ǻĢ��>M���1@��UD��	.ͪ��)S��%�9�}���e���Q�#�k1BQI���E[D�Y���d;�T��h��1���D�cs4 ��Xed��<�� \��2�����"�F��x���R��	�6���Ռ$ ����v�] �/4)�[u�
7���!�����ZV�Z��f�J��BN�����W���{Ď;Z}���(�$�X��)�2޼��$��������1s5ὂ��޼�a��h�ΆBUr���(J�n�U�4U�?��FP���\��\,zg��{��{�*����HB����|�\�^WVY'���K��Ȳ� /��%��8o�V�KH� ��4�,�8b�K�rɷ����!]�ې�/�c�x��eˢY��M�Y���ƶ�A��1����y,z{��E����-�&\[�Ǫ��ȱ:��[ޡ"�>qǈ��".@�^A��<Ħ �����w>���;�����:�
Ѣ�?��-veq3�93B��@��$�eiK�� %#3�q3ٕ�(�Тk����G!�N�uY��#b�l����������-      k      x������ � �      o   $  x��V����g���@����FLH�J�_�`Rd*� �eV,A�,v 8��7�)>�� �%�ą�EO����:�NU���EE�
JKC����:d����I(��1Jy:_��ϟ���W/�hO�?y������~�y?�x��7�W���Om|��ދb�XHĭM5g֕U�H-����ؒ��D��2�΅�M�ʐ�\7���yY_Cܧ[��%Ζ7&�@8�P>r:�\����$j0�4#5��!�����qi������� V����y���I�5q�,A��S. ��2k��&ע۫�ۢ������j+�9�dI�b��mt�H� >�6���r����o
Z(O�)�G#�B��ب��B��#��V� W$'�9�4i�t,w2��l..Ĺ��:hU�զO�]�Jt<=�6�ءhFV�hBJ��	��1��Խ=�[ߏ���R��MF�3T_e:�,-�A�ŋ �Fs(���D��מS�u�����z4��&K�*���J�w�2����T��6�+������1��V��׊��?������_<3���.h�_^< )�,�Ohpe|���S�l���e�z���1.�s���ѩ��K�Q�M4��9���mF�B`*��@�a>!�+�C�u:�fM1sU�ã1[M��"��7���G�)�E���&Rlٝ��=�k�匐�鵬8�i��	8sA�"sr�T������4�l/�@���Q�����S�t�̡����=�:ʔ�������~���j����޷��߼���������~���fQ�Y�C�����iF�g穕z[0���Q�ţk�z�ޘ�/��"Қ!T����V��"�k�CM2�[	�!=�B�5����a�6?���v0�_�t���^��&��7�� �Zj&�R�|�!�6���%.})�>����hԜ���X긔O�< JGӷ�.vp�/�����GB����5�lyD��?��x�0ow��y�\�K���)�DA���bH$=[�=�G���r�����&��b
Z"Ϻ��j<�ETGr��]�����3�K����K��lܭ|�������ֆL���e�
ig*V��4����_��s�j:��,0�A�9%V������:h5Gqt�A��8`�� _Q=�.�k
Pwv��,��тj��E��r����o��O�y��O��O���~�i?}������p��~{����;�t���IOʦ��Nd�v��@���0\�Ą �	S��5�Uka��8(����@7U:F
�Ռ����1�a��ˌ�o8�R��>9�� W      r   �  x��Yێ\7|��
� J$%q>b� /�m`�������2�ێ��6��3�c���Ū3�t�ٌ�K&�(*�}1�f��j�U��%͹��Q<9#Y���\��\��B:�P[�Ԥ��E��~���_��q}��EꋦGkw���S'^�KAtn�z));^�Y��L�;�O�R�1)[���jK�m�ƫ�B��Ok��F F��H������_��_?��c*��5Q6d]Zʭ�~[������$V��O�P�W�/�~���Jl���܋�L�f�f�i�I�]{I�,������Q�-%�Q)�^��v_���'{����Gk��"Gm�x�#�=(b��>۬%L��\��. �⡹�.�l%��%�������[�v c�M�V���T�.]�' lD����B֠�������>�^|�^��D"�UȭVZC BK{�}��2�И ��;�����S�T�"�X�G��2�N����4k�Q�Z�,�^�����RRPJ��	z���+�a��^��:A����=Ў�V]K�d�ȑo���N[u��3uO7)HH1F����$s��@N��A|�]��0����3��GW��.��ئ���V��"7��;2�������V���9���#k��q�"˵��NuDf˱-�g�S_�=Z��6%5*��6@w66�d�Ew�+���LI�����D�p���2>&N������Л;x�/����Ĕ������1
r{���ZN������ށ�ٕ6Z�I#��-}��Q��g�!�g�!��f�3�k�)�����n]�"�ܢ��s����=薷��Z��qɌf�v��M��Mvm���h��D��b"3��4��l8<}�1���>㘂�6Д�@b�o�"'�X-�m���O�>����1s���@�ϥ�Be��ĸ��z���%�!|6ʵ�L�#,�M��@�Y��&
<j���G¸݌�א�Kz��$�%�-9"G��II�_���@� f(���4B9�Lט߷� $I�UC�+��H�c�����'���5_�4��;�?��ܱ]��@��f	�ݩ&HOu\r���15�hS��7}�t�P��*F��"��wV��!���J�.�ŗ������Q��`�B��BM�H������VN3��@6z	_/!�	�7p_ߐ�g"�M|��>�9�!pWu��9ׅ��9��v�����xC�(� ��yؓ�v8���X�3Y[�ϝ���$z�^`s[9�o�Ӳ!�;������!J&�+X�����!|yj(��0)���.t���Y���`�f#��j�&���}��M�3�{N���j�����g����g���\c8Oy\�E��n�hi��:{;�U�R�3�;�d�>9���v��	i�q|�qf����������6=��Mқ�\kѽ
Y\���� ����g݇��9�Wh$(�������m@y�v��IM���������ʽ�T%���L�=��H(��[ި߀5���ne���C'��cU��^b5O�fH�f��&����V�u^Ԃ���>$H��LQ%�C��r�D�p��݂�.E`��Bn�����Gk�UdQ�ț����Jp=Lp�ث^����9����`_�״�&�V��< ,��Q�>'>l�એy��Q�i�\�`l�R��|{N|���Y��[__}6�u���̽�:ßOp� �X�4���RZe��0*���`�>��������5�o�R��c�$<�@_��Q���;��c.�Q�[�E���/N�jM���8k���n�Ȱ{��8���� �yZm�������������@.V8a4��,%��Y�84VO��Ë�:�Iv���ąd��y�������G�}
�j v�L�������C��'CK�#�&,�=��`FO�8�He�T�˘dX`�q���ٗ��5�v��WDQ:��A�	�4BD�q�**Ͻ7�s���O���i�xj�}j����̦��6��c��3���Q���~W���zM���� ���      t      x������ � �      u   A  x��V˪�F]K_�e���]]�a�	�C�'�����2��M6di�Á��rC4�OIK�<��Rw!�sN�}p�di���Apu�V9��&�D�(��e}de	�fU�͸}7���������[�6Ͽ��9�5�A�
Տu({�^��g:!{ֽ��(��R��Y�`=���62��J&�<}��y��~��w/��<���m~�o7��ws����ݍ��sTB��<FJ��E
,��v����U��!� !Lv����o�p?�Ň�޺��~s?A�����dgK�c�>�͢�N�2�`,Uؘx��BUD�������5��K͇�����c��0n��Y��x�}1'���8�4����O&2�i��_�@�ӳ��գi�
SJ��3P)��0��J�,s��<YH�c��fsV����vmJ�*�X�ڂ�^�ʎmt���Ş�}���������yj$V<�d��:�XN�&��<��B4�Y-��I�U�s�A0�hR��X0�D��+��������ǹ7=���k�Cmݟ.f����k"z?1��~���ێtm@����0�!uIuW�.S�T_�u�����р�� 
��m!�J������@�-����.ꅾ�µ�e�p��t�ki���$bY^����>S��@wG����~���E�*�l���lm�0gf]g���o5���o��̊���h��Y"�}R��'g�U�� ���|I�Mq�sr-t�<������6����Z �ĐZ�V
BA�#lm}���L���OF�!�]s�i���ljg;�(���������m��9t2      p      x������ � �      l   �   x��̻q1�W����Tf+�P��(ָ��
Pr��@���-�����a�i�͖;	��?֓�7R�ĒYӗ����Ɏ�>�|r�V8�����$�(�J��3���Z��X&���Q'K�۫ ��3gi1�7�
�%�R8���*�&Jt=s޿��x�JU      q     x��Wˎ�D]�|�,RM����!(B ����9c�G�nB�"���� ��"�(#��O�Vu�d�X�yZ�qU����snq��#�K�
G5�<(l�Q�ĉ��āPD�U�� ���� �H�A�2N��n��ۯ���㾻�w�}�k���wO��~�=���&�.O8�x�t�ȄbZ"�a��)�S�3��ݟ}��_����+_��w���Ǽ��~}+�v������c�A!�}@k�t�ag)��$�q������+W\l�X�Z�����P�ٍ�2��%����s8v�.h9�|J� v���ƈ���-��F�3�B�%�ʎ#y��jW�Y���Z�(>	GmX��*��(e�Rb@�1)�Pb�I"��ueDFI���p�F�Ҫv)�f��^]BX�A5.�\b����bz�|��UK�O
{�LG����߬4�H�1�y+#ц��~5�U�W��5����(�_U��}#�N�˱�`����kHM�S�J� ��bG�؏#x�
���hYͫ��4��4��j��2E�b��~�y��ߴ{�@����cHX퐖X��ł�@�u#Y��f��R`[^�Wmp[�|+g'a��RN��a��+3oj�	s�L�iD�;4G�`�b(�AВ���~�MV����4����o�I�;�� ԓ�ؓ���/ۍ���&0�֣�f�y��Y��'YO���E���������]�W�枕�[��v�����#����Y�<Ϋ?(����}*үh���r;j��pe� ���y�cB9&�;���o}�N�A���T��|Ԑ8$Z1��� ��Xi��t�I�gc�ay�ؽR�
��H	&yx0b!d�H�ȴ�TB�cx�i���ﵦ�*<(>��ra\)���6��,�&;�i	&�b��R��P��0C��*�Y�M_"ޱ�u�ŅŢq@���� ���Yl��f����G0�a�R �dD)|tK:���_̋O�;�A�M�2�Wz`�� ��������&���Q�jQ��K
�a���i����Ň��2,6���p���TN	Ķ�[s�|�V7�X0�r`��� qHk��X焍nd&_�m�.@�[��{��k��SN�-��R�9?$�,�D�����6c��P�X�d~�lڌ�ðl+�H��W#���ADBQ!��%�������i�rRz5uj�����\��!%��@�L=���P4�K.�C\h,(�HI^"�l�t�ؑ){Jqc��!�3Sׯ��inb=�m�z5�vj�eD��R_������!��p��쑷��gv��ل����|�L���$�>�C�H渾�]���s/�?,^�y/�y��~iڣ����}qZ�{r�E�83mh~Ix�y73���=xe·ig�����^���c�蠩}>���ׯ�4��,l6V��	�ء���)���x%<�l�Wz�y��C\�����~v�x�GW�[���/��ޜ��y#5I9�m��(��e����ag���HǑ��!���r��|��Fi������7n���R����������$O*v      n      x������ � �      s      x������ � �     