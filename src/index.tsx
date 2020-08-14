// 基础知识
// function
// function greeter(person: string) {
//   return `Hello, ${person}`;
// }
// const user = 'Jane User';
// console.log(greeter(user));

// interface
// interface User {
//   readonly name: string;
//   age?: number;
// }
// const user: User = {
//   name: 'Sophia',
// };
// function foo(bar: { name: string }) {
//   const baz = bar;
//   baz.name = 'Sophia';
// }
// foo(user);

// executable interface
// interface ReturnItemFn<T> {
//   (para: T): T
// }
// const returnItem: ReturnItemFn<number> = q => q;
// returnItem(1);

// Class
// export default class Props {
//   public children: Array<React.ReactElement<any>> | React.ReactElement<any> | never[] = [];
//   public speed: number = 500;
//   public height: number = 160;
//   public animation: string = 'easeInOutQuad';
//   public isAuto: boolean = true;
//   public autoPlayInterval: number = 4500;
//   public afterChange: () => {};
//   public beforeChange: () => {};
//   public selesctedColor: string;
//   public showDots: boolean = true;
// }

// definitely assigned
// let num!: number;
// initialize();
// console.log(num);
// function initialize() {
//   num = 1;
// }

// TypeScript in React
// import React from 'react';
// interface State {
//   itemText: string;
// }
// const todoInputDefaultProps = {
//   inputSetting: {
//     maxLength: 20,
//     placeholder: '请输入todo',
//   },
// };
// type Props = {
//   handleSubmit: (value: string) => void;
//   children: React.ReactNode;
// } & typeof todoInputDefaultProps;
// // （在defaultProps中设置默认值时，只需要记得，不要在接口中为有默认值的属性添加可选的'?'就能支持）
// // // 在可选参数提供默认值的情况下，规避Props内可选参数可能为undefined的情况
// // const createPropsGetter = <T extends Object>() => {
// //   return <U extends Partial<T>>(props: U) => {
// //     type PropsExcludingDefaults = Omit<U, keyof T>;
// //     type RecomposedProps = T & PropsExcludingDefaults;

// //     return props as RecomposedProps;
// //   };
// // };
// // const getProps = createPropsGetter<typeof todoInputDefaultProps>();
// export class TodoInput extends React.Component<Props, State> {
//   public static defaultProps = todoInputDefaultProps;
//   private inputRef = React.createRef<HTMLInputElement>();
//   constructor(props: Props) {
//     super(props);
//     this.state = {
//       itemText: '',
//     };
//   }
//   private updateValue(e: React.ChangeEvent<HTMLInputElement>) {
//     this.setState({ itemText: e.target.value });
//   }
//   private handleSubmit(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault();
//     if (!this.state.itemText.trim()) {
//       return;
//     }
//     this.props.handleSubmit(this.state.itemText);
//     this.setState({ itemText: '' });
//   }
//   public render() {
//     const { inputSetting } = this.props;
//     return (
//       <form onSubmit={this.handleSubmit}>
//         <input
//           ref={this.inputRef}
//           className="edit"
//           value={this.state.itemText}
//           maxLength={inputSetting.maxLength}
//           onChange={this.updateValue}
//         />
//         <button type="submit">添加</button>
//       </form>
//     );
//   }
// }

// 索引类型、索引类型查询操作符keyof、索引访问操作符[]
// interface Obj {
//   [props: string]: any
// }
// function pick(o: Obj, names: string[]) {
//   return names.map(n => o[n]);
// } //不可取
// function pick<T, K extends keyof T>(o: T, names: K[]): T[K][] {
//   return names.map((n) => o[n]);
// }
// const user = {
//   id: 123456789,
//   username: 'Sophia',
//   token: '987654321',
//   avatar: '',
//   role: 'vip'
// }
// const res = pick(user, ['token', 'id']);

// 映射类型[K in Keys]，例如partial实现
// type partial<T> = { [K in keyof T]?: T[K] }

// 类型编程
// 条件类型，注，never类型大展身手
// declare function f<T extends boolean>(x: T): T extends true ? string : number;
// const x = f(Math.random() < 0.5)
// const y = f(false)
// const z = f(true)

// 条件类型的特性：分布式有条件类型，该特性的前提条件：naked type parameter,在满足条件时，该特性类似于Array.map()
// type NakedUsage<T> = T extends boolean ? 'YES' : 'NO';
// type WrappedUsage<T> = [T] extends [boolean] ? 'YES' : 'NO';
// type Distributed = NakedUsage<number | boolean>; //  = NakedUsage<number> | NakedUsage<boolean> =  "NO" | "YES"
// type NotDistributed = WrappedUsage<number | boolean>; // "NO"
// // 例子:Diff，找出不包括在后面类型中的前面类型；Filter，找出包括在后面类型中的前面类型；MyNonNullable，剔除null和undefined
// type Diff<T, U> = T extends U ? never : T;
// type R = Diff<'a' | 'b' | 'c' | 'd', 'a' | 'c' | 'f'>;
// type Filter<T, U> = T extends U ? T : never;
// type R1 = Filter<string | number | (() => void), Function>;
// type MyNonNullable<T> = Diff<T, null | undefined>;
// type R2 = MyNonNullable<string | number | undefined>;

// 条件类型搭配映射类型——设计工具类型
// 例子：取出接口中函数类型的名称
// type FunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? K : never }[keyof T];
// interface Part {
//   id: number;
//   name: string;
//   subparts: Part[];
//   updatePart(newName: string): void;
// }
// type R = FunctionPropertyNames<Part>;
// 例子：取出接口中的可选类型，我的答案：
// type NullableKeys<T> = { [K in keyof T]: undefined extends T[K] ? K : never }[keyof T];
// interface People {
//   id: string;
//   name: string;
//   age?: number;
//   from?: string;
// }
// type R = NullableKeys<People>;
// 高级答案？？？：

// infer——泛型约束中的待推断类型
// 例子：设计ReturnType
// type MyReturnType<T> = T extends (...args: any[]) => infer P ? P : any;
// interface User {
//   id: number;
//   name: string;
//   from?: string;
// }
// type Foo = () => User;
// type R = MyReturnType<Foo>;
// 例子：设计ConstructorParameters<T>——提取构造函数中的参数类型
// type MyConstructorParameters<T extends new (...args: any[]) => any> = T extends new (
//   ...args: infer P
// ) => any
//   ? P
//   : never;
// class TestClass {
//   constructor(public name: string, public age: number) {}
// }
// type R = MyConstructorParameters<typeof TestClass>;
// 问，为什么typeof Class能拿到构造函数？

// infer应用：tuple转union——[string, number] -> string | number
// type ElementOf<T> = T extends Array<infer E> ? E : never;
// type MyTuple = [string, number];
// type ToUnion = ElementOf<MyTuple>;
// infer应用：union转intersection——string | number -> string & number
// type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
//   ? I
//   : never;
// type R = UnionToIntersection<string | number>;

// 工具类型设计
// 内置类型工具ReturnType、Partial、ConstructorParameters、Pick、Exclude、Extract等
// 例：Exclude<T>，从T中排除可分配给U的元素，这里的可分配即assignable,指可分配的,T extends U指T是否可分配给U
// type MyExclude<T, U> = T extends U ? never : T;

// 泛型、类型递归、关键字
// interface Company {
//   id: number;
//   name: string;
// }
// interface Person {
//   id: number;
//   name: string;
//   address: string;
//   company: Company;
// }
// type DeepPartial<T> = {
//   [U in keyof T]?: T[U] extends object ? DeepPartial<T[U]> : T[U];
// };
// type R = DeepPartial<Person>;

// 常见工具类型
// Omit = Exclude + Pick，Omit<T, K>指忽略T中的某些属性，这些药忽略的属性存在由K描述
// type MyOmit<T, K> = Pick<T, Exclude<keyof T, K>>;
// type Foo = MyOmit<{ name: string; age: number }, 'name'>;

// Merge<O, P> = Compute<A> + Omit<U, T>，Merge<Obj1, Obj2>指将两个对象属性合并，其中Compute将交叉类型合并
// type Compute<T extends any> = T extends Function ? T : { [K in keyof T]: T[K] };
// type R = Compute<{ x: 'x' } & { y: 'y' }>;
// type Merge<Obj1 extends Object, Obj2 extends Object> = Compute<Obj1 & Omit<Obj2, keyof Obj1>>;

// Intersection<T, U> = Extract + Pick，指提取T的属性，此属性同时存在于U
// type Intersection<T extends Object, U extends Object> = Pick<
//   T,
//   Extract<keyof T, keyof U> & Extract<keyof U, keyof T>
// >;
// type Props = { name: string; age: number; visible: boolean };
// type DefaultProps = { age: number };
// type DuplicateProps = Intersection<Props, DefaultProps>;

// Overwrite<T, U>指用U的属性覆盖T的相同属性
// type Overwrite<T extends Object, U extends Object, I = Exclude<T, U> & Intersection<U, T>> = Pick<
//   I,
//   keyof I
// >;
// type Props = { name: string; age: number; visible: boolean };
// type NewProps = { age: string; other: string };
// type ReplacedProps = Overwrite<Props, NewProps>;
// Overwrite有误为什么？

// Mutable<T>指将所有readonly属性移除
// type Mutable<T> = {
//   -readonly [K in keyof T]: T[K];
// };

// TypeScript使用技巧：注释、Omit复用属性、Record以Union为基础创建新类型

// 类型设计

// TS工程化、开发环境配置
